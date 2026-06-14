import * as vscode from 'vscode'

let bar: vscode.StatusBarItem
let sessionEarnings = 0

export function initStatusBar(context: vscode.ExtensionContext): void {
  bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  bar.command = 'claudecash.openDashboard'
  context.subscriptions.push(bar)
  render()
}

export function addEarnings(amount: number): void {
  sessionEarnings += amount
  render()
}

export function disposeStatusBar(): void {
  bar?.dispose()
}

function render(): void {
  const key = vscode.workspace.getConfiguration('claudecash').get<string>('apiKey')
  if (!key) {
    bar.text = 'C$ Setup'
    bar.tooltip = 'ClaudeCash: Click to set your API key'
    bar.command = 'claudecash.setApiKey'
  } else {
    bar.text = `C$ $${sessionEarnings.toFixed(4)}`
    bar.tooltip = `ClaudeCash: $${sessionEarnings.toFixed(4)} earned this session`
    bar.command = 'claudecash.openDashboard'
  }
  bar.show()
}
