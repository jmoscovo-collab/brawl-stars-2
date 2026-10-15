# Notebook do Davi (Windows) — setup único

Feito pelo Julio uma vez. Depois disso o Davi abre o terminal, digita `claude` dentro da pasta e trabalha.

## 1. Ferramentas (PowerShell como admin)
```powershell
winget install Git.Git GitHub.cli OpenJS.NodeJS.LTS Python.Python.3.12
```
Fechar e reabrir o terminal. Claude Code já está instalado (`claude --version`).

## 2. GitHub (conta do Davi, adicionada como colaboradora no repo)
```powershell
gh auth login          # GitHub.com → HTTPS → login no navegador
git config --global user.name "Davi"
git config --global user.email "<email-github-do-davi>"
gh repo clone jmoscovo-collab/brawl-stars-2 C:\cogumelo
```
Julio: *Settings → Collaborators* do repo → adicionar a conta do Davi com **Write**.

## 3. Claude Code
```powershell
cd C:\cogumelo
claude            # /login na primeira vez
```
O `CLAUDE.md` da pasta já carrega todo o contexto (regras, pipeline, lições). Não precisa copiar sessão nenhuma.

## 4. Aviso no Telegram do Julio a cada turno (auditoria)
Variável de ambiente do usuário Davi: `TG_BOT_TOKEN=<token do bot Juca>` (Julio digita, não vai pro repo).
Em `C:\Users\<davi>\.claude\settings.json`:
```json
{
  "hooks": {
    "Stop": [{"hooks": [{"type": "command", "command": "python C:\\cogumelo\\tools\\tg_notify_davi.py", "timeout": 15, "async": true}]}]
  }
}
```

## 5. Acesso remoto do Julio
- **Chrome Remote Desktop** (ver/controlar a tela, grátis): https://remotedesktop.google.com/access → instalar no notebook, logado no Google do Julio.
- **Tailscale** (rede privada) + **OpenSSH Server** do Windows (`Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0`; `Set-Service sshd -StartupType Automatic; Start-Service sshd`): Julio entra por `ssh davi@<nome-tailscale>` do Mac e lê `C:\Users\<davi>\.claude\projects\` (transcrições das sessões) e `git log`.
- **Microsoft Family Safety** na conta do Davi: tempo de tela e relatório de apps.
