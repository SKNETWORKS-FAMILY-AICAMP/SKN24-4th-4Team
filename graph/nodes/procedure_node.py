# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# graph/nodes/procedure_node.py
# 역할 : 보험사 약관 기반 절차를 안내한다 (retrieve + generate 통합)
#
# 파이프라인: ④ 절차 안내
# 진입 조건 : analyze_node 에서 intent == "procedure"
#             (insurer 슬롯이 확정된 상태로 진입)
# 다음 노드  : END
#
# 흐름:
#   1. slots 에서 treatment / plan 을 꺼내 검색 쿼리를 보강
#   2. insurer 에 맞는 컬렉션 선택
#      - nhis              → "nhis" 컬렉션
#      - 일반 보험사       → "{insurer}_plans" 컬렉션
#      - insurer 미확정    → query_collection 내부에서 빈 컬렉션 처리
#   3. RAG 검색
#   4. LLM 으로 단계별 안내 + 필요 서류 목록 생성
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

from __future__ import annotations

from graph.nodes.generate_node import call_llm_with_docs, _build_sources, _call_llm_for_related_questions
from graph.nodes.retrieve_node import query_collection
from utils.schemas import InsuranceState

# ──────────────────────────────────────────────────────────────
# 상수
# ──────────────────────────────────────────────────────────────
_PROCEDURE_SYSTEM_PROMPT = """You are a health insurance procedure guide.
Explain insurance procedures in clear, numbered steps.
Always include:
1. Step-by-step process (numbered list)
2. Required documents checklist
3. Estimated timeline
4. Important notes or warnings

Base your answer ONLY on the provided documents.
If a step is not covered in the documents, note that the user should contact the insurer directly."""


# ──────────────────────────────────────────────────────────────
# 노드 함수
# ──────────────────────────────────────────────────────────────

def procedure(state: InsuranceState) -> dict:
    """
    [파이프라인 ④] 보험 절차를 단계별로 안내한다.

    읽는 state 필드:
        user_message : 사용자 원문 질의
        language     : 응답 언어 코드
        insurer      : 보험사 코드 (보험사별 절차 우선 검색)
        slots        : 추출된 슬롯 (treatment, plan 등)

    반환 dict (InsuranceState 업데이트):
        retrieved_docs    : 검색된 절차 문서 리스트
        answer            : 단계별 절차 안내 + 필요 서류 목록
        sources           : 참조 문서 출처 리스트
        related_questions : 연관 질문 리스트
    """
    user_msg = state["user_message"]
    language = state.get("language", "en")
    insurer  = state.get("insurer", "")
    slots    = state.get("slots", {})

    # ── Step 1: 슬롯 기반 쿼리 보강 ───────────────────────────
    # slots 에서 treatment / plan 을 꺼내 검색 쿼리를 구체화한다.
    # 예) user_msg = "입원하려면 어떻게 해요?"
    #     treatment = "입원", plan = "Gold"
    #     → enriched_query = "입원하려면 어떻게 해요? 입원 Gold procedure"
    treatment = slots.get("treatment", "")
    plan      = slots.get("plan", "")

    query_parts = [user_msg]
    if treatment:
        query_parts.append(treatment)
    if plan:
        query_parts.append(plan)
    query_parts.append("procedure")          # 절차 관련 청크 우선 검색
    enriched_query = " ".join(query_parts)

    # ── Step 2: 컬렉션 선택 ────────────────────────────────────
    # nhis 는 별도 컬렉션명을 사용한다 (compare_node 와 동일한 규칙)
    if insurer == "nhis":
        collection_name = "nhis"
    elif insurer:
        collection_name = f"{insurer}_plans"
    else:
        # insurer 미확정 — query_collection 내부에서 빈 컬렉션 오류를 잡아
        # 빈 리스트를 반환하므로 그대로 진행한다.
        collection_name = "_plans"

    # ── Step 3: RAG 검색 ───────────────────────────────────────
    docs = query_collection(
        collection_name = collection_name,
        query           = enriched_query,
        top_k           = 5,
    )

    # ── Step 4: LLM 단계별 절차 생성 ──────────────────────────
    answer = call_llm_with_docs(
        user_query     = user_msg,
        retrieved_docs = docs,
        language       = language,
        extra_context  = slots,
        system_prompt  = _PROCEDURE_SYSTEM_PROMPT,
    )

    sources           = _build_sources(docs)
    related_questions = _call_llm_for_related_questions(
        user_query = user_msg,
        answer     = answer,
        language   = language,
    )

    return {
        "retrieved_docs"   : docs,
        "answer"           : answer,
        "sources"          : sources,
        "related_questions": related_questions,
    }
