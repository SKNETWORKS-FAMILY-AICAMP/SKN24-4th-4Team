# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# graph/nodes/retrieve_node.py
# 역할 : ChromaDB 에서 관련 문서를 검색한다 (공통 RAG 검색 헬퍼)
#
# 파이프라인: 모든 파이프라인 노드(① ② ③ ④ ⑤ ⑥)에서
#             query_collection() / query_multi_collections() 을
#             import 해서 직접 호출하는 방식으로 사용
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

from __future__ import annotations

from pathlib import Path
import chromadb
from chromadb.config import Settings

from langchain_huggingface import HuggingFaceEmbeddings

# 상수

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
VECTORDB_PATH = str(_PROJECT_ROOT / "vectordb")
DEFAULT_TOP_K = 5   # 기본 검색 결과 수

# 05.01 - 모델을 매 쿼리마다 새로 로드하면 수백 MB를 반복 로딩하므로 모듈 레벨에서 캐싱
_embedding_model: HuggingFaceEmbeddings | None = None

def _get_embedding_model() -> HuggingFaceEmbeddings:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = HuggingFaceEmbeddings(
            model_name     = "BAAI/bge-m3",
            model_kwargs   = {"device": "cpu"},
            encode_kwargs  = {"normalize_embeddings": True},
        )
    return _embedding_model


# 공개 헬퍼 — 모든 파이프라인 노드에서 import 해서 사용

def query_collection(
    collection_name: str,
    query: str,
    top_k: int = DEFAULT_TOP_K,
    where: dict | None = None,
) -> list[dict]:
    """
    단일 ChromaDB 컬렉션에서 유사 문서를 검색한다.

    Args:
        collection_name : 검색할 컬렉션 이름
        query           : 검색 쿼리 텍스트
        top_k           : 반환할 최대 문서 수
        where           : 메타데이터 필터 (예: {"source_type": "pdf_table"})

    Returns:
        [{"content": str, "metadata": dict, "score": float}, ...] 형태의 문서 리스트
        컬렉션이 없거나 오류 시 빈 리스트 반환
    """
    try:
        client     = chromadb.PersistentClient(
            path     = VECTORDB_PATH,
            settings = Settings(anonymized_telemetry=False),
        )

        collection = client.get_collection(name=collection_name)

        model       = _get_embedding_model()
        query_vec   = model.embed_query(query)

        # 메타데이터 필터 포함 여부에 따라 쿼리 분기
        query_kwargs: dict = {
            "query_embeddings": [query_vec],
            "n_results"        : top_k,
            "include"          : ["documents", "metadatas", "distances"],
        }
        if where:
            query_kwargs["where"] = where

        results = collection.query(**query_kwargs)

        # ChromaDB 결과를 통일 형식으로 변환
        docs      = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        return [
            {
                "content" : doc,
                "metadata": meta,
                "score"   : round(1 - dist, 4),  # cosine distance → similarity
            }
            for doc, meta, dist in zip(docs, metadatas, distances)
            if doc and doc.strip()
        ]

    except Exception as e:
        # 컬렉션 미존재 또는 DB 오류 → 빈 결과 반환 (서비스 중단 방지)
        print(f"[retrieve_node] 검색 오류 ({collection_name}): {e}")
        return []


def query_multi_collections(
    collection_names: list[str],
    query: str,
    top_k_each: int = 5,
) -> dict[str, list[dict]]:
    """
    여러 컬렉션을 병렬로 검색한다. (② 보험사 비교 파이프라인 용)

    Args:
        collection_names : 검색할 컬렉션 이름 리스트
        query            : 검색 쿼리 텍스트
        top_k_each       : 컬렉션당 반환할 최대 문서 수

    Returns:
        {collection_name: [doc_dict, ...]} 형태
    """
    return {
        name: query_collection(name, query, top_k_each)
        for name in collection_names
    }
