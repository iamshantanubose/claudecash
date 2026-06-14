import * as vscode from 'vscode'
import { randomBytes } from 'node:crypto'
import { API_BASE, AD_DURATION_MS } from './config'
import { initStatusBar, addEarnings, disposeStatusBar } from './statusbar'
import type { Ad } from './types'

/** Only https:// URLs are allowed to open externally — blocks javascript:, file://, vscode:// etc. */
function safeOpen(url: string): void {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return
    vscode.env.openExternal(vscode.Uri.parse(url))
  } catch { /* invalid URL — ignore */ }
}

export function activate(context: vscode.ExtensionContext): void {
  initStatusBar(context)

  context.subscriptions.push(
    vscode.commands.registerCommand('claudecash.openDashboard', () => {
      safeOpen(`${API_BASE}/dashboard`)
    }),
    vscode.commands.registerCommand('claudecash.setApiKey', async () => {
      const key = await vscode.window.showInputBox({
        prompt: 'Paste your ClaudeCash API key',
        placeHolder: 'Get it from claudecash.co/dashboard',
        password: true,
      })
      if (key) {
        await vscode.workspace.getConfiguration('claudecash').update('apiKey', key, true)
        vscode.window.showInformationMessage('C$ ClaudeCash: API key saved — earning starts now.')
      }
    }),
    vscode.commands.registerCommand('claudecash.showBalance', () => {
      safeOpen(`${API_BASE}/dashboard`)
    }),
  )

  const apiKey = vscode.workspace.getConfiguration('claudecash').get<string>('apiKey')
  if (!apiKey) {
    vscode.window.showInformationMessage(
      'C$ ClaudeCash installed! Set your API key to start earning.',
      'Set API Key', 'Get Key'
    ).then(action => {
      if (action === 'Set API Key') vscode.commands.executeCommand('claudecash.setApiKey')
      if (action === 'Get Key') safeOpen(`${API_BASE}/dashboard`)
    })
  }

  watchForAI(context)
}

function watchForAI(context: vscode.ExtensionContext): void {
  let lastTrigger = 0

  context.subscriptions.push(
    vscode.window.onDidOpenTerminal(() => {
      const now = Date.now()
      if (now - lastTrigger > 10_000) {
        lastTrigger = now
        setTimeout(() => showAd(), 1200)
      }
    }),
    vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, {
      provideInlineCompletionItems: () => {
        const now = Date.now()
        if (now - lastTrigger > AD_DURATION_MS + 1000) {
          lastTrigger = now
          showAd()
        }
        return []
      },
    })
  )
}

async function showAd(): Promise<void> {
  const apiKey = vscode.workspace.getConfiguration('claudecash').get<string>('apiKey')
  if (!apiKey) return

  try {
    const res = await fetch(`${API_BASE}/api/ad`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return
    const { ad } = await res.json() as { ad: Ad | null }
    if (!ad) return

    // Validate ad URL before rendering
    try {
      const u = new URL(ad.url)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return
    } catch { return }

    const nonce = randomBytes(16).toString('base64')
    const panel = vscode.window.createWebviewPanel(
      'claudecashAd', 'C$ ClaudeCash',
      vscode.ViewColumn.Beside,
      { enableScripts: true, retainContextWhenHidden: false }
    )

    panel.webview.html = adHtml(ad, nonce)
    panel.webview.onDidReceiveMessage(msg => {
      if (msg.type === 'click') safeOpen(ad.url)
      if (msg.type === 'done') panel.dispose()
    })
    setTimeout(() => panel.dispose(), AD_DURATION_MS + 500)

    const imp = await fetch(`${API_BASE}/api/impression`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bid_id: ad.id, api_key: apiKey }),
      signal: AbortSignal.timeout(5000),
    })
    if (imp.ok) {
      const { earned } = await imp.json() as { earned: number }
      addEarnings(earned ?? 0)
    }
  } catch { /* never interrupt the developer */ }
}

function adHtml(ad: Ad, nonce: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;
  align-items:center;justify-content:center;min-height:100vh;padding:32px}
.badge{background:#ffd400;padding:3px 10px;font-size:11px;font-weight:900;font-family:monospace;margin-bottom:20px}
.card{border:1px solid #e8e8e8;padding:28px 32px;width:100%;max-width:420px;
  cursor:pointer;text-align:center;transition:border-color .15s}
.card:hover{border-color:#ffd400}
.sponsor{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
.brand{font-size:12px;font-weight:700;color:#555;margin-bottom:6px}
.text{font-size:19px;font-weight:800;color:#0a0a0a;letter-spacing:-.02em;margin-bottom:10px}
.bar{width:100%;height:3px;background:#f0f0f0;margin-bottom:10px}
.fill{height:100%;background:#ffd400;animation:drain ${AD_DURATION_MS}ms linear forwards}
.earned{font-size:12px;color:#16a34a;font-weight:600}
.skip{margin-top:14px;font-size:11px;color:#ccc;cursor:pointer}
@keyframes drain{from{width:100%}to{width:0%}}
</style></head><body>
<div class="badge">C$ ClaudeCash</div>
<div class="card" onclick="vscode.postMessage({type:'click'})">
  <div class="sponsor">Sponsored</div>
  ${ad.brand ? `<div class="brand">${esc(ad.brand)}</div>` : ''}
  <div class="text">${esc(ad.text)}</div>
  <div class="bar"><div class="fill"></div></div>
  <div class="earned">Earning on this impression →</div>
</div>
<div class="skip" onclick="vscode.postMessage({type:'done'})">skip</div>
<script nonce="${nonce}">const vscode=acquireVsCodeApi();setTimeout(()=>vscode.postMessage({type:'done'}),${AD_DURATION_MS})</script>
</body></html>`
}

export function deactivate(): void {
  disposeStatusBar()
}
