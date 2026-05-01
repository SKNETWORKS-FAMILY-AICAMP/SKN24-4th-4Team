# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# graph/nodes/compare_node.py
# 역할 : 여러 보험사를 동시에 비교한다
#
# 파이프라인: ② 보험사 간 비교
# 진입 조건 : analyze_node 에서 intent == "cross_compare"
# 다음 노드  : END
#
# 흐름:
#   1. insurers 리스트의 각 컬렉션에서 병렬 RAG 검색
#   2. 결과 병합 + Re-ranking
#   3. 비교 프롬프트 조립
#   4. LLM 직접 호출 — JSON 강제 (_call_llm_json)
#   5. 응답 파싱 (parse_compare_table)
#   6. sources 추출 후 state 반환
#
# [변경 내역]
#   - call_llm_with_docs() 제거 → LLM 직접 호출(_call_llm_json)로 교체
#     이유: response_format={"type":"json_object"} 로 JSON 파싱 안정성 확보
#   - 반환 dict에 compare_table, related_questions, sources 추가
#     이유: FastAPI JSON 응답 구조에 맞추고, related_questions 3개를
#           프론트엔드 버튼으로 표시하기 위함
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

from __future__ import annotations

import json
import os

from openai import OpenAI

from graph.nodes.retrieve_node import query_multi_collections
from utils.comparison import build_comparison_prompt, parse_compare_table, rerank_by_relevance
from utils.schemas import InsuranceState

# ──────────────────────────────────────────────────────────────
# 상수
# ──────────────────────────────────────────────────────────────
_CROSS_SYSTEM_PROMPT = """You are a health insurance comparison specialist.
Compare the insurance companies based ONLY on the provided documents.
You MUST respond with valid JSON only — no other text, no markdown.
Present a clear comparison covering coverage, costs, network, and claim process.
If information is missing, state "정보 없음"."""



# 노드 함수

def compare(state: InsuranceState) -> dict:
    """
    [파이프라인 ②] 여러 보험사를 비교하는 답변을 생성한다.

    읽는 state 필드:
        user_message : 사용자 원문 질의
        language     : 응답 언어 코드
        insurers     : 비교할 보험사 코드 리스트 (예: ["uhcg", "cigna"])
        insurer      : insurers 가 비어있을 때 fallback 단일 보험사
        slots        : 추출된 슬롯 (treatment, plan 등)

    반환 dict (InsuranceState 업데이트):
        retrieved_docs    : 모든 보험사의 검색 문서 통합 리스트
        answer            : 자연어 비교 요약 (LLM JSON의 "answer" 필드)
        compare_table     : {"header": [...], "body": [[...]]} 비교표 구조체
        related_questions : 관련 질문 3개 리스트 (프론트엔드 버튼용)
        sources           : 출처 정보 리스트 (최대 5개)
    """
    user_msg = state["user_message"]
    language = state.get("language", "en")
    insurers = state.get("insurers", [])
    slots    = state.get("slots", {})

    #  비교 대상 보험사 결정 
    if not insurers:
        single   = state.get("insurer", "")
        insurers = [single] if single else []

    if not insurers:
        insurers = ["uhcg", "cigna", "tricare", "msh_china"]

    # 보험사별 컬렉션 이름 매핑 
    collection_map: dict[str, str] = {
        ins: ("nhis" if ins == "nhis" else f"{ins}_plans")
        for ins in insurers
    }

    #병렬 멀티 컬렉션 RAG 검색 
    results_by_collection = query_multi_collections(
        collection_names = list(collection_map.values()),
        query            = user_msg,
        top_k_each       = 5,
    )

    col_to_ins: dict[str, str] = {v: k for k, v in collection_map.items()}
    docs_by_insurer: dict[str, list[str]] = {}
    all_retrieved: list[dict] = []

    for col_name, docs in results_by_collection.items():
        insurer_name = col_to_ins.get(col_name, col_name).upper()
        ranked       = rerank_by_relevance(
            docs      = [d["content"]  for d in docs],
            metadatas = [d["metadata"] for d in docs],
            top_k     = 5,
        )
        docs_by_insurer[insurer_name] = [d["content"] for d in ranked]
        all_retrieved.extend(ranked)

    #  비교 프롬프트 조립 
    comparison_prompt = build_comparison_prompt(
        docs_by_subject = docs_by_insurer,
        user_query      = user_msg,
        language        = language,
    )

    # LLM 직접 호출 (JSON 강제) 
    raw_response = _call_llm_json(comparison_prompt)
    #  JSON 파싱 
    compare_table, answer, related_questions = parse_compare_table(raw_response)

    #  sources 추출
    # 05.01 - file_name → source 로 변경 (팀 공통 메타데이터 형식: source = 파일명)
    sources = [
        {
            "document_name": doc["metadata"].get("source") or doc["metadata"].get("url", ""),
            "page"         : doc["metadata"].get("page"),
            "section"      : doc["metadata"].get("topic"),
        }
        for doc in all_retrieved[:5]
    ]

    return {
        "retrieved_docs"   : all_retrieved,
        "answer"           : answer,
        "compare_table"    : compare_table,
        "related_questions": related_questions,
        "sources"          : sources,
    }


# 내부
def _call_llm_json(prompt: str) -> str:
    """JSON 출력을 강제하는 LLM 호출 함수."""
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model           = "gpt-4o",
            messages        = [
                {"role": "system", "content": _CROSS_SYSTEM_PROMPT},
                {"role": "user",   "content": prompt},
            ],
            response_format = {"type": "json_object"},
            max_tokens      = 2000,
            temperature     = 0.1,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        return json.dumps({
            "header"           : [],
            "body"             : [],
            "answer"           : f"응답 생성 중 오류가 발생했습니다. ({type(e).__name__})",
            "related_questions": [],
        }, ensure_ascii=False)
