"""
HR Dashboard Copilot backend server.

Usage:
1. pip install anthropic
2. Set ANTHROPIC_API_KEY
3. python copilot_server.py
4. Open http://localhost:8080

Routes:
- /api/chat (legacy dashboard-compatible route)
- /api/copilot/dashboard
- /api/copilot/personnel
- /api/upload
"""

import http.server
import json
import os
import sys
from urllib.parse import urlparse

# ============================================================
# ?ㅼ젙
# ============================================================
PORT = 8080
DASHBOARD_FILE = "HR_Dashboard_v5.html"
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 2048

# API ?? ?섍꼍蹂???곗꽑, ?놁쑝硫??꾨옒??吏곸젒 ?낅젰
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# ============================================================
# HR ?쒖뒪???꾨＼?꾪듃 ??Claude?먭쾶 ??븷쨌?곗씠?걔룹쓳??洹쒖튃 遺??
# ============================================================
SYSTEM_PROMPT = """You are an HR analytics copilot for the dashboard application.
Use only provided context data and clearly separate facts from inferences.
Be concise, practical, and avoid exposing unnecessary personal details.

Current app context:
{dashboard_data}
"""

PERSONNEL_SYSTEM_PROMPT = """You are an HR personnel review copilot for a regular promotion and calibration application.
Use the provided personnel context only as decision-support data. Do not present recommendations as final decisions.
When discussing eligibility, grade calibration, transfers, or promotion scenarios, explain the basis, uncertainty, and required human review.
Avoid exposing unnecessary personal data.

Current app context:
{dashboard_data}
"""

APP_SYSTEM_PROMPTS = {
    'dashboard': SYSTEM_PROMPT,
    'personnel': PERSONNEL_SYSTEM_PROMPT,
}

# ============================================================
# ?쒕쾭 ?몃뱾??
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
        parsed = urlparse(self.path)
        if parsed.path == '/api/chat':
            self._handle_chat('dashboard')
        elif parsed.path.startswith('/api/copilot/'):
            app_scope = parsed.path.rsplit('/', 1)[-1] or 'dashboard'
            self._handle_chat(app_scope)
        elif parsed.path == '/api/upload':
            self._handle_upload()
        else:
            self.send_error(404)

    def _handle_chat(self, app_scope='dashboard'):
        # ?붿껌 ?뚯떛
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length > 0 else {}
        user_msg = body.get('message', '')
        dashboard_data = body.get('context', '{}')
        history = body.get('history', [])

        if not user_msg:
            self._json_response(400, {'error': 'message ?꾨뱶 ?꾩닔'})
            return

        if not API_KEY:
            self._json_response(500, {'error': 'ANTHROPIC_API_KEY 誘몄꽕?? ?섍꼍蹂???먮뒗 copilot_server.py ??API_KEY???ㅼ젙 ?꾩슂'})
            return

        # Claude API ?몄텧
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=API_KEY)

            prompt_template = APP_SYSTEM_PROMPTS.get(app_scope, SYSTEM_PROMPT)
            system = prompt_template.replace('{dashboard_data}', dashboard_data)

            # ????대젰 援ъ꽦 (理쒓렐 10??
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
            self._json_response(200, {'answer': answer, 'model': MODEL, 'app': app_scope})

        except ImportError:
            self._json_response(500, {'error': 'anthropic package is missing. Run: pip install anthropic'})
        except Exception as e:
            err_msg = str(e)
            # Normalize common API error cases into stable response payloads.
            if 'credit balance' in err_msg or 'billing' in err_msg.lower():
                self._json_response(402, {
                    'error': 'Insufficient API credit. Recharge billing in the Anthropic console.',
                    'error_type': 'billing'
                })
            elif 'authentication' in err_msg.lower() or 'api_key' in err_msg.lower():
                self._json_response(401, {
                    'error': 'Authentication failed. Check your API key.',
                    'error_type': 'auth'
                })
            elif 'rate_limit' in err_msg.lower():
                self._json_response(429, {
                    'error': 'Rate limit exceeded. Retry after a short delay.',
                    'error_type': 'rate_limit'
                })
            else:
                self._json_response(500, {
                    'error': f'API call failed: {err_msg}',
                    'error_type': 'unknown'
                })
            sys.stderr.write(f"[Copilot Error] {err_msg}\n")

    def _handle_upload(self):
        """?뚯씪 ?낅줈???몃뱾??(AXIS 3)"""
        try:
            # multipart/form-data ?뚯떛
            content_length = int(self.headers.get('Content-Length', 0))
            content_type = self.headers.get('Content-Type', '')

            if 'multipart/form-data' not in content_type:
                self._json_response(400, {'error': 'multipart/form-data ?꾩슂'})
                return

            # 媛꾨떒???뚯씪 ???(?꾨줈?뺤뀡?먯꽌????寃ш퀬???뚯떛 ?꾩슂)
            boundary = content_type.split('boundary=')[1].encode()
            body = self.rfile.read(content_length)

            # ?뚯씪紐?異붿텧 (媛꾨떒??諛⑹떇)
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
                'message': '?뚯씪 ?낅줈???꾨즺'
            })
            sys.stderr.write(f"[Upload] {filename} saved to {filepath}\n")

        except Exception as e:
            self._json_response(500, {'error': f'?낅줈???ㅽ뙣: {str(e)}'})
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
        # 濡쒓렇 媛꾩냼??
        if '/api/chat' in str(args):
            sys.stderr.write(f"[Copilot] {args[0]}\n")


# ============================================================
# 硫붿씤
# ============================================================
if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if not API_KEY:
        print("[Warning] ANTHROPIC_API_KEY is not set.")
        print("   Set environment variable: ANTHROPIC_API_KEY='sk-ant-...'")
        print("   Or inject API_KEY directly in copilot_server.py")
        print()

    server = http.server.HTTPServer(('0.0.0.0', PORT), CopilotHandler)
    print("HR Dashboard Copilot server started")
    print(f"   http://localhost:{PORT}")
    print(f"   model: {MODEL}")
    key_display = f"{API_KEY[:10]}***{API_KEY[-4:]}" if len(API_KEY) > 14 else ('configured' if API_KEY else 'missing')
    print(f"   api key: {key_display}")
    print("   Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        server.shutdown()
