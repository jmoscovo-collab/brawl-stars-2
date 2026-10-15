# Hook Stop do Claude Code no notebook do Davi: avisa o Telegram do Julio o que foi feito.
# Token vem da variavel de ambiente TG_BOT_TOKEN (nunca commitar).
import json, os, sys, subprocess, urllib.parse, urllib.request
tok = os.environ.get("TG_BOT_TOKEN")
if not tok:
    sys.exit(0)
try:
    d = json.load(sys.stdin)
except Exception:
    d = {}
cwd = d.get("cwd", "")
try:
    log = subprocess.run(["git", "-C", cwd, "log", "-1", "--format=%h %s"], capture_output=True, text=True, timeout=5).stdout.strip()
except Exception:
    log = ""
msg = f"🍄 Davi/Claude terminou um turno em {os.path.basename(cwd) or '?'}\nÚltimo commit: {log or '(nenhum)'}"
data = urllib.parse.urlencode({"chat_id": "104683320", "text": msg}).encode()
try:
    urllib.request.urlopen(f"https://api.telegram.org/bot{tok}/sendMessage", data, timeout=10)
except Exception:
    pass
