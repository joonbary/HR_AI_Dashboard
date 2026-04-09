"""
OK금융그룹 HR Dashboard v4 — AI 인사부장 Copilot 백엔드
사용법:
  1. pip install anthropic --break-system-packages
  2. export ANTHROPIC_API_KEY="sk-ant-..."  (또는 아래 API_KEY 변수에 직접 입력)
  3. python copilot_server.py
  4. 브라우저에서 http://localhost:8080 접속

구조:
  - / → HR_Dashboard_v4.html 서빙
  - /api/chat → Claude API 프록시 (POST, JSON: {message, context})
  - /api/upload → 파일 업로드 처리 (POST, multipart/form-data)
"""

import http.server
import json
import os
import sys
from urllib.parse import urlparse

# ============================================================
# 설정
# ============================================================
PORT = 8080
DASHBOARD_FILE = "HR_Dashboard_v5.html"
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 2048

# API 키: 환경변수 우선, 없으면 아래에 직접 입력
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# ============================================================
# HR 시스템 프롬프트 — Claude에게 역할·데이터·응답 규칙 부여
# ============================================================
SYSTEM_PROMPT = """당신은 OK금융그룹 인사부 전용 AI 인사부장입니다.
대시보드에 표시된 HR 데이터를 기반으로 인사 담당자의 질문에 답변합니다.

## 역할
- OK금융그룹 인사부의 동료로서, 데이터에 기반한 정확한 분석과 실무적 제안을 제공
- 노동법·세법 판단 시 관련 조항을 함께 제시
- 수치를 인용할 때는 반드시 아래 데이터에서 확인한 값만 사용

## 응답 규칙
1. 확실성 표기: [확정] 법령·데이터 근거 / [유력] 판례·해석 경향 / [참고] 미확인·추정
2. 문체: 음슴체 (문장 끝을 ~임, ~됨, ~함, ~필요 등으로 종결, 마침표 생략)
3. 분량: 간결하게, 핵심 먼저. 불릿포인트 중심
4. 법적 리스크 🔴 수준이면 선제 경고 + 전문가 자문 권고
5. 개인정보 노출 금지 (집계·익명화된 형태로만 답변)

## 조직 맥락
- OK금융그룹: OKH(지주), OK저축은행, OC캐피탈, ACI신용정보, AFI에프앤아이, OKAX(IT), ON+소규모
- 신인사제도(2025~): 성장레벨 Lv.1~4, 절대평가 7등급(S~D), CEI 3축 평가
- 매니저 직군: 2023-08 도입, PL→매니저 재분류 (퇴사→재고용), 최저임금+회수실적급
- 4B 인력방침(2026): 외부채용 금지(임원·영업·AI전문가 제외), 신입 20명 소수정예
- Work SHIFT: S(Streamline), H(Hybrid), I(Insight), F(Forecast), T(Track)
- 하위 조직은 '팀'이 아닌 '파트'로 표기

## 특수 명령어 (응답에 포함 가능)

아래 HTML 코멘트 형식의 명령어를 응답에 포함하면 대시보드가 자동으로 실행합니다.
명령어는 응답 텍스트와 함께 자연스럽게 배치하세요.

### 1. 차트 생성
데이터를 시각화할 때 사용합니다:
<!--CHART:{"type":"bar|line|doughnut","title":"차트제목","labels":["A","B"],"datasets":[{"label":"범례","data":[10,20],"backgroundColor":["#E8572A","#FCAF17"]}]}-->

### 2. 대시보드 네비게이션
사용자가 특정 탭이나 법인 데이터를 보고 싶어할 때:
<!--NAV:{"tab":"tab-workforce|tab-performance|tab-ai|tab-risk|tab-insight|tab-exec"}-->
<!--NAV:{"filter":"OKH|OK|OC|ACI|AFI|OKAX|ON+소규모"}-->

### 3. 시나리오 시뮬레이션
What-if 질문에 대한 시뮬레이션:
<!--SIM:{"type":"hiring","count":20}-->
<!--SIM:{"type":"turnover","rate":0.08}-->
<!--SIM:{"type":"salary","increaseRate":0.05}-->

### 4. 보고서 생성
요약 보고서 요청 시:
<!--REPORT:{"title":"보고서제목","content":"마크다운 형식의 내용"}-->

## 사용 규칙
- 차트는 질문에 데이터 비교/추이가 포함될 때만 사용
- NAV는 사용자가 "리스크 탭 보여줘", "OC 데이터 보자" 같이 명시적으로 요청할 때
- SIM은 "~하면 어떻게 될까", "만약 ~" 같은 가정형 질문에만
- REPORT는 "보고서 만들어줘", "요약해줘" 같은 명시적 요청에만
- 명령어 JSON은 반드시 유효한 JSON이어야 함
- 한 응답에 명령어 최대 3개까지

### 5. 임원보고 자동 생성
사용자가 "임원보고 만들어줘", "보고서 다운로드", "Executive Summary" 요청 시:
<!--EXEC_REPORT-->
이 마커를 포함하면 대시보드가 자동으로 현재 데이터 기반 임원보고 HTML을 생성하여 다운로드합니다.

## 현재 대시보드 데이터 (실시간)
아래 JSON은 대시보드의 D 객체에서 추출한 실데이터입니다. 이 데이터만을 기반으로 답변하세요.

{dashboard_data}
"""

# ============================================================
# 서버 핸들러
# ============================================================
class CopilotHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/' or parsed.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open(DASHBOARD_FILE, 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/chat':
            self._handle_chat()
        elif self.path == '/api/upload':
            self._handle_upload()
        else:
            self.send_error(404)

    def _handle_chat(self):
        # 요청 파싱
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length > 0 else {}
        user_msg = body.get('message', '')
        dashboard_data = body.get('context', '{}')
        history = body.get('history', [])

        if not user_msg:
            self._json_response(400, {'error': 'message 필드 필수'})
            return

        if not API_KEY:
            self._json_response(500, {'error': 'ANTHROPIC_API_KEY 미설정. 환경변수 또는 copilot_server.py 내 API_KEY에 설정 필요'})
            return

        # Claude API 호출
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=API_KEY)

            system = SYSTEM_PROMPT.replace('{dashboard_data}', dashboard_data)

            # 대화 이력 구성 (최근 10턴)
            messages = []
            for h in history[-10:]:
                messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
            messages.append({"role": "user", "content": user_msg})

            response = client.messages.create(
                model=MODEL,
                max_tokens=MAX_TOKENS,
                system=system,
                messages=messages
            )

            answer = response.content[0].text
            self._json_response(200, {'answer': answer, 'model': MODEL})

        except ImportError:
            self._json_response(500, {'error': 'anthropic 패키지 미설치. pip install anthropic 실행 필요'})
        except Exception as e:
            err_msg = str(e)
            # 에러 유형별 친절한 메시지
            if 'credit balance' in err_msg or 'billing' in err_msg.lower():
                self._json_response(402, {
                    'error': 'API 크레딧 잔액 부족 — console.anthropic.com에서 크레딧을 충전하세요',
                    'error_type': 'billing'
                })
            elif 'authentication' in err_msg.lower() or 'api_key' in err_msg.lower():
                self._json_response(401, {
                    'error': 'API 키 인증 실패 — 키 값을 다시 확인하세요',
                    'error_type': 'auth'
                })
            elif 'rate_limit' in err_msg.lower():
                self._json_response(429, {
                    'error': 'API 요청 한도 초과 — 잠시 후 다시 시도하세요',
                    'error_type': 'rate_limit'
                })
            else:
                self._json_response(500, {
                    'error': f'API 호출 오류: {err_msg}',
                    'error_type': 'unknown'
                })
            sys.stderr.write(f"⚠️  {err_msg}\n")

    def _handle_upload(self):
        """파일 업로드 핸들러 (AXIS 3)"""
        try:
            # multipart/form-data 파싱
            content_length = int(self.headers.get('Content-Length', 0))
            content_type = self.headers.get('Content-Type', '')

            if 'multipart/form-data' not in content_type:
                self._json_response(400, {'error': 'multipart/form-data 필요'})
                return

            # 간단한 파일 저장 (프로덕션에서는 더 견고한 파싱 필요)
            boundary = content_type.split('boundary=')[1].encode()
            body = self.rfile.read(content_length)

            # 파일명 추출 (간단한 방식)
            filename = 'uploaded_' + str(os.getpid()) + '.xlsx'
            temp_dir = os.path.join(os.getcwd(), 'uploads')
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir)

            filepath = os.path.join(temp_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(body)

            self._json_response(200, {
                'success': True,
                'filename': filename,
                'filepath': filepath,
                'message': '파일 업로드 완료'
            })
            sys.stderr.write(f"[Upload] {filename} saved to {filepath}\n")

        except Exception as e:
            self._json_response(500, {'error': f'업로드 실패: {str(e)}'})
            sys.stderr.write(f"[Upload Error] {str(e)}\n")

    def _json_response(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        # 로그 간소화
        if '/api/chat' in str(args):
            sys.stderr.write(f"[Copilot] {args[0]}\n")


# ============================================================
# 메인
# ============================================================
if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if not API_KEY:
        print("⚠️  ANTHROPIC_API_KEY가 설정되지 않았습니다")
        print("   export ANTHROPIC_API_KEY='sk-ant-...'  또는")
        print("   copilot_server.py 내 API_KEY 변수에 직접 입력")
        print()

    server = http.server.HTTPServer(('0.0.0.0', PORT), CopilotHandler)
    print(f"🚀 HR Dashboard Copilot 서버 시작")
    print(f"   http://localhost:{PORT}")
    print(f"   모델: {MODEL}")
    key_display = f"{API_KEY[:10]}***{API_KEY[-4:]}" if len(API_KEY)>14 else ('설정됨' if API_KEY else '미설정')
    print(f"   API 키: {key_display}")
    print(f"   Ctrl+C로 종료")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버 종료")
        server.shutdown()
