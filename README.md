# 🏥 DaCare - AI 기반 해외 의료보험 상담 서비스


> **250만 한국 내 외국인 거주자의 보험 정보 접근성 문제를 LLM + RAG로 해결합니다.**

---

## 📌 목차
1. [팀 소개](#1-팀-소개)
2. [프로젝트 개요](#2-프로젝트-개요)
3. [기술 스택](#3-기술-스택)
4. [WBS](#4-wbs)
5. [요구사항 정의서](#5-요구사항-정의서)
6. [화면 설계서](#6-화면-설계서)
7. [시스템 아키텍처](#7-시스템-아키텍처)
8. [테스트 계획 및 결과](#8-테스트-계획-및-결과)
9. [수행 결과 및 향후 개선점](#9-수행-결과-및-향후-개선점)
10. [한 줄 회고](#10-한-줄-회고)

---

## 1. 팀 소개

**팀명: DaCare (다케어)**

## 👥 팀 소개

**팀명: DaCare (다케어)**

| 권민제 | 김수진 | 김은우 | 김지원 |
|--------|--------|--------|--------|
| <img width="371" height="509" alt="은우님" src="https://github.com/user-attachments/assets/75496207-b338-413e-b55e-68319733ca49" /> | <<img width="380" height="517" alt="수진님" src="https://github.com/user-attachments/assets/bc69100f-7124-4432-8a06-c44e728c4533" /> |<img width="380" height="517" alt="민제님" src="https://github.com/user-attachments/assets/5ffb6c96-fad5-448c-ba40-2a424064bf2c" />| <img width="380" height="517" alt="지원님" src="https://github.com/user-attachments/assets/354a6bb5-452a-42a6-8e17-4a08eb3daf52" /> |
| [GitHub](https://github.com/min3802) | [GitHub](https://github.com/KimSujin02) | [GitHub](https://github.com/whitehole17) | [GitHub](https://github.com/edu-ai-jiwon) |

---
## 2. 프로젝트 개요

### 배경 (Background)

*   **국내 체류 외국인 250만 명 돌파와 '다문화 국가' 진입**
    *   2024년 말 기준 국내 체류 외국인은 약 250만 명을 넘어섰으며, 인구 대비 비중이 5%에 육박하며 OECD 기준 '다문화·다인종 국가'의 문턱에 들어섰습니다.
    *   🔗 **[법무부 통계자료 출입국통계](https://www.moj.go.kr/moj/2412/subview.do)**

*   **외국인 보험 가입 급증 및 정보 비대칭**
    *   외국인 유학생 및 근로자의 보험 가입률은 매년 두 자릿수 성장률을 기록하고 있으나, 설문조사에 따르면 외국인 거주자의 약 60%가 "복잡한 용어와 언어 장벽으로 인해 보험 혜택을 포기한 적이 있다"고 답했습니다.
    *   🔗 **[한국소비자원 - 외국인 소비자 국내 보험 이용 실태조사 (상세 보도자료)](https://www.kcredit.or.kr:1441/archive/cisReportView.do?_csrf=ba7c8471-bc09-4f0a-bb1c-1ac81beb00e9&hpBoardSn=CIS_REPORT&hpBoardIdSn=1648&menuNo=420&link=archive%2FcisReportView.do&searchData=searchDateCbo%3Dall%40%40searchFiledCbo%3Dall%40%40searchTextEdt%3D%EB%B3%B4%ED%97%98%40%40searchPage%3D1)**


*   **허위 정보(Hallucination)로 인한 금전적 피해 방지**
    *   금융감독원은 2024년 생성형 AI의 금융 서비스 도입을 공식화하면서, 동시에 AI 응답의 부정확성으로 인한 소비자 피해 방지를 위한 가이드라인 마련을 병행하고 있습니다. 보험과 같은 전문 금융 분야일수록 RAG 기반의 문서 참조형 AI가 범용 AI보다 안전합니다.
    *   🔗 **[금융감독원 - AI 활용 금융 서비스 제공 시 소비자 보호 유의사항 안내](https://www.fss.or.kr/fss/bbs/B0000188/view.do?nttId=188825&menuNo=200218)**



### 3차 → 4차 변경 사항

| 항목 | 3차 프로젝트 | 4차 프로젝트 |
|------|------------|------------|
| UI | Streamlit (로컬 실행) | Django 웹 서비스 (회원가입/로그인) |
| 지원 보험사 | Allianz, Bupa, Cigna, TRICARE | **UnitedHealth, Cigna, TRICARE, MSH China** |
| AI 서버 | 단일 서버 | FastAPI 별도 서버 (LangGraph 파이프라인) |
| 인증 | 없음 | 세션 기반 로그인/회원가입 |
| 채팅 관리 | 없음 | 히스토리 저장/조회/삭제 |
| 배포 | 로컬 | AWS EC2 |

---

## 3. 기술 스택

### Frontend / Web
| 분야 | 기술 | 
|------|------|
| 웹 프레임워크 | ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white) | 
| 언어 | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white) | 
| DB | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | 
| 인증 | 세션 기반 인증 | 

### AI / LLM 서버
| 분야 | 기술 | 선택 이유 |
|------|--------------------------------------|------|
| API 서버 | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) | 비동기 처리로 LangGraph 파이프라인 병렬 호출에 최적 |
| AI 파이프라인 | ![LangGraph](https://img.shields.io/badge/LangGraph-000000?style=for-the-badge&logo=chainlink&logoColor=white) | 노드 단위 상태 관리 + 조건부 라우팅으로 복잡한 intent 분기 처리 |
| LLM | ![OpenAI](https://img.shields.io/badge/GPT--4o--mini-OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white) | 안전 필터·intent 분류·언어 감지 및 관련질문, 최종답변 mini로 비용 절감. 동급 성능의 sLLM은 최소 A100급 GPU(약 $2.79/hr) 필요<br> — API 방식 대비 인프라 비용 및 운영 부담이 커 OpenAI API 채택 |
| 임베딩 | ![bge-m3](https://img.shields.io/badge/BAAI-bge--m3-FF6F00?style=for-the-badge) | 단일 모델로 100개 언어 임베딩 통일 — 다국어 문서 혼재 문제 해결 |
| 벡터 DB | ![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-5A31F4?style=for-the-badge) | 외부 서버 없이 로컬 파일 기반 운영 — EC2 단일 인스턴스 배포에 적합 |
| RAG 프레임워크 | ![LangChain](https://img.shields.io/badge/LangChain-005F73?style=for-the-badge) | |

### 인프라
| 분야 | 기술 | 
|----------------|----------------------------------------------------|
| Cloud          | ![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white) ![AWS RDS](https://img.shields.io/badge/AWS-RDS-527FFF?style=for-the-badge&logo=amazonaws&logoColor=white) |
| GPU Inference  | ![RunPod](https://img.shields.io/badge/RunPod-GPU_Inference-7B61FF?style=for-the-badge) |
| Container      | ![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Web Server     | ![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white) |
| External API   | ![Frankfurter](https://img.shields.io/badge/Frankfurter-Exchange%20Rate%20API-blue)  |

---

## 4. WBS

<img width="2788" height="2040" alt="WBS" src="https://github.com/user-attachments/assets/97eb7fc1-be47-4963-8345-fc9896b7c90e" />


---

## 5. 요구사항 정의서

### 주요 기능 요구사항 (REQ-CHAT-001)

<img width="3479" height="2480" alt="요구사항명세서" src="https://github.com/user-attachments/assets/b7906b3c-2b16-47bb-8676-2b27209569f1" />


---

## 6. 화면 설계서

<img width="3000" height="1688" alt="4차 프로젝트 화면설계서_page-0001" src="https://github.com/user-attachments/assets/cccd9ee3-2667-4065-95d7-7bc34ddc87fb" />
<img width="3000" height="1688" alt="4차 프로젝트 화면설계서_page-0002" src="https://github.com/user-attachments/assets/590160b2-a375-4bad-a71e-90db85f59e9f" />
<img width="3000" height="1688" alt="4차 프로젝트 화면설계서_page-0005" src="https://github.com/user-attachments/assets/94da2d36-2d02-49f7-a894-c9fe8bdd2850" />
<img width="3000" height="1688" alt="4차 프로젝트 화면설계서_page-0010" src="https://github.com/user-attachments/assets/eec7d3b9-3c9e-4143-8748-8adb476deca8" />


---

## 7. 시스템 아키텍처

<img width="6160" height="4600" alt="시스템아키텍쳐" src="https://github.com/user-attachments/assets/9ff3cdd5-d237-472d-b374-2683f4059882" />



### LangGraph 파이프라인

사용자 질문은 `analyze_node`에서 안전 필터 → 언어 감지 → Intent 분류를 거쳐 8개 전문 노드 중 하나로 라우팅됩니다. 각 노드는 ChromaDB RAG 검색 후 GPT-4o-mini로 최종 답변을 생성합니다.

| Intent | 파이프라인 | 설명 |
|--------|-----------|------|
| within_compare | within_node | 동일 보험사 내 플랜 비교 |
| cross_compare | compare_node | 여러 보험사 간 비교 |
| calculation | calculate_node | 환율·본인부담금 계산 |
| procedure | procedure_node | 보험 절차 안내 |
| nhis | nhis_node | 국민건강보험 상담 (민간보험 청구 감지 시 claim_node로 추가 라우팅) |
| claim | claim_node | 청구 절차 + 청구서 양식 제공 |
| general_query | general_node | 일반 보장·혜택 질의 |
| clarify | clarify_node | 정보 부족 시 사용자에게 추가 정보 요청 |
| blocked | END | 안전 필터 차단 (악성·무관 요청) |

### 지원 보험사 및 데이터

**민간 해외 의료보험**

| 보험사 | 코드 | 비고 |
|--------|------|------|
| UnitedHealth (UHCG) | uhcg | 신규 |
| Cigna | cigna | 유지 |
| TRICARE | tricare | 유지 |
| MSH China | msh_china | 신규 |

**공공 의료보험**

| 서비스 | 코드 | 비고 |
|--------|------|------|
| 국민건강보험 (NHIS) | nhis | 한국 거주 외국인 대상 공공 의료보험 안내 |

---

## 8. 테스트 계획 및 결과

<img width="2870" height="2480" alt="테스트 결과 표" src="https://github.com/user-attachments/assets/853a9c14-c284-4eb6-b163-067aafcf5402" />




### 테스트 요약
| 분류 | TC 수 | Pass | Fail |
|------|------:|-----:|-----:|
| 인증 | 10 | 9 | 1 |                                                                                                                                                                                        
| 채팅-Intent | 9 | 9 | 0 |
| 채팅-제약 | 5 | 5 | 0 |                                                                                                                                                                                     
| 채팅-다국어 | 7 | 7 | 0 |                               
| 히스토리 | 3 | 3 | 0 |
| 피드백 | 2 | 2 | 0 |
| **합계** | **36** | **35** | **1** |

---

## 9. 수행 결과 및 향후 개선점

### 3차 vs 4차 응답 성능 비교

| **3차 응답** | **4차 응답** |
| :---: | :---: |
| <img width="1051" height="605" alt="image" src="https://github.com/user-attachments/assets/5a96908d-966d-4b9b-a1b8-c2006cf27ae1" /> | <img width="1135" height="633" alt="image" src="https://github.com/user-attachments/assets/d4f47bc8-89e8-410b-8ea3-171df27338b9" />|
| 본인부담금을 계산하지 않아도 되는 상황에서 불필요한 플랜과 정보를 물어보며 RAG를 통해 기간이 제한되어 있다는 응답은 내놓지만 구체적으로 며칠인지는 응답하지 못합니다. | 본인부담금 계산하지 않는 상황에서 불필요한 플랜과 정보를 물어보지 않고 RAG 성능을 향샹시켜 구체적으로 국적국에서의 치료는 보험기간동안 최대 **180일** 적용 된다는 답변을 내놓습니다. |


### 시연 시나리오

1. 회원가입 → 로그인
2. Cigna 선택 → 일반 보장 질문 (출처 포함 응답 확인)
3. TRICARE vs Cigna 비교 요청 (비교표 확인)
4. 본인부담금 계산 요청 (환율 적용 확인)
5. 청구서 양식 요청 (PDF 다운로드 확인)
6. 보험 추천 요청 → 안내 불가 메시지 확인
7. 채팅 히스토리 조회 → 이전 대화 이어서 질의

### 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| NHIS 대화 중 맥락 답변 오분류 | "E-7 비자예요", "회사 다녀요" 같은 맥락 의존 답변을 Intent Router가 단독으로 보면 `clarify`로 오분류 | NHIS 대화 진행 중(`nhis_step` 존재 시) LLM 재분류를 건너뛰고 `nhis_node`로 직접 라우팅 |
| LangGraph 이전 턴 데이터 잔류 | SqliteSaver가 thread_id 기준으로 상태를 유지해 이전 턴의 `claim_form`, `compare_table`, `sources`가 다음 응답에 남음 | `analyze_node` 진입 시마다 응답 전용 필드를 초기화해 턴 간 데이터 오염 방지 |
| 멀티턴 follow-up 질문 오분류 | "그 플랜 얼마야?" 같은 맥락 의존 질문을 Intent Router가 이전 대화 없이 독립 질문으로 처리 | `chat_history` 최근 6턴을 Intent Router에 전달해 맥락 기반 재분류 |

### 향후 개선점

| 항목 | 내용 | 이유 |
|------|------|------|
| FastAPI 인증 | API Key 또는 JWT 인증 추가 | 현재 Django ↔ FastAPI 내부 통신에 인증 없어 직접 호출 가능한 보안 취약점 존재 |
| RAG 평가 체계 | 정량 평가 파이프라인 구축 (RAGAS 등) | 현재 응답 품질을 수동으로만 확인 — 보험사 추가 시 품질 회귀 감지 불가 |
| 개인화 | 사용자 플랜 정보 저장 후 맞춤 답변 | 매 대화마다 보험사·플랜을 다시 설명해야 하는 불편함 해소 |
| 보험사 확대 | 현재 4개 → 추가 민간 보험사 지원 | 국내 체류 외국인이 가입한 보험사 다양화에 대응 |
| 언어 전환 | 대화 중 명시적 언어 전환 요청 처리 | 다국어 사용자가 한 대화 내에서 언어를 바꿀 경우 현재 감지 불안정 |

---

## 10. 한 줄 회고

| 이름 | 회고 |
|------|------|
| 권민제 | 이번 프로젝트에서 데이터 전처리 파이프라인 구축을 담당하며 단순히 모델에 데이터를 넣는 것이 아니라, 양질의 입력이 응답 품질을 얼마나 좌우하는지 직접 체감할 수 있었습니다. LangGraph 노드 작업을 통해 AI 워크플로우가 어떻게 흐름을 타는지 이해할 수 있었고, 모델 단에서의 작은 설계 결정이 전체 시스템에 미치는 영향이 생각보다 크다는 것을 배웠습니다. |
| 김수진 | 기존 웹 개발 경험을 바탕으로 웹 파트를 빠르게 구축하여 LLM 개발 단계에 같이 진입할 수 있었습니다. 이번 프로젝트를 통해 초기 단계에서 의존성 버전을 requirements로 통일하고, 웹–LLM 연동을 선행해 조기 테스트를 수행함으로써 오류와 개선사항을 빠르게 도출하고 고도화하는 과정의 중요성을 체감했습니다. 또한 claim-node 개발 과정에서는 파일 내용을 임베딩해 RAG 기반으로 질문과의 유사도를 측정하여 관련 파일을 탐색하고 다운로드까지 연결하는 기능을 구현했으며, FastAPI, Django,RunPod, AWS를 아우르는 전체 아키텍처 설계와 함께 웹과 모델 간 데이터 구조 및 인터페이스를 어떻게 설계해야 효율적으로 동작하는지에 대해 깊이 고민할 수 있었습니다. |
| 김은우 | LLM retriever 노드에서 HyDE와 Dense + BM25 하이브리드 RRF를 직접 구현하며 검색 성능의 본질을 파고들었고, 벡터 DB 장애를 반복적으로 겪으면서 구현 실력보다 설계와 팀 환경 통일이 시스템 안정성의 선결 조건임을 뼈저리게 실감했습니다. |
| 김지원 |compare_node에서 가장 황당했던 버그는 들여쓰기였습니다. continue 하나가 for 루프 바깥에 있었습니다. Python은 들여쓰기로 블록을 구분하는데, 수십 줄짜리 for 루프 안에서 try/except 중첩이 깊어지다 보니 continue가 예외 처리 블록 밖으로 빠져나가져 있었습니다. 실제로 실행하면 SyntaxError도 아니고 논리오류라 바로 잡히지 않았습니다. 비교 결과가 보험사마다 일관되지 않게 나올 때서야 발견했습니다.|

---
