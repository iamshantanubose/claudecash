<div align="center">

<img alt="ClaudeCash" src="media/logo.svg" width="280">

### Get paid while AI thinks.

**ClaudeCash** turns the loading time inside Claude Code, GitHub Copilot, and Cursor
into a tiny sponsored slot — and pays **50% of ad revenue directly to you**.

[![Website](https://img.shields.io/badge/claudecash.co-1a6b3a?style=for-the-badge&logoColor=white)](https://claudecash.co)
[![VS Code](https://img.shields.io/badge/VS%20Code-Install-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=claudecash.claudecash-ai)
[![Cursor](https://img.shields.io/badge/Cursor-Install-a855f7?style=for-the-badge&logo=vscodium&logoColor=white)](https://open-vsx.org/extension/claudecash/claudecash-ai)
[![CLI](https://img.shields.io/badge/npm-@claudecash%2Fcli-cb3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@claudecash/cli)

</div>

---

## How it works

When Claude Code or Copilot is thinking, your machine is idle. ClaudeCash fills that 5-second window with a single sponsored card. Advertisers bid for the slot in an open auction — you earn 50% of every impression, automatically.

```diff
- ⠿ Claude is thinking…
+ ⠿ Vercel — deploy in seconds, globally ↗   (you just earned $0.0025)
```

No code is read. No prompts are touched. Ads only appear during wait time.

---

## Install

### VS Code

1. Open Extensions (`Cmd+Shift+X`) → search **ClaudeCash** → Install
2. Run **ClaudeCash: Set API Key** from the command palette
3. Get your key at **[claudecash.co/dashboard](https://claudecash.co/dashboard)**

→ **[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=claudecash.claudecash-ai)**

### Cursor

1. Open Extensions → search **ClaudeCash** → Install  
   *(Cursor pulls from Open VSX automatically)*
2. Set your API key via **ClaudeCash: Set API Key**

→ **[Install from Open VSX](https://open-vsx.org/extension/claudecash/claudecash-ai)**

### Claude Code CLI

```bash
npm install -g @claudecash/cli
claudecash login --key YOUR_API_KEY
claudecash run "explain this function"
```

→ **[View on npm](https://www.npmjs.com/package/@claudecash/cli)**

---

## How the money works

| | |
|---|---|
| **Revenue share** | 50% of every impression goes to you |
| **Clicks** | Worth 50× an impression |
| **Minimum payout** | $10.00 via Stripe |
| **Balance** | Live in your status bar + full ledger at claudecash.co |

---

## Compatibility

| Editor | How to install |
|---|---|
| VS Code | Marketplace (see above) |
| VS Code Insiders | Marketplace |
| Cursor | Open VSX (see above) |
| Remote-SSH / devcontainers | Works automatically via VS Code server |

---

## Want to advertise?

Reach developers at the one moment they're paying attention — while they wait.

→ **[Place an ad at claudecash.co](https://claudecash.co)**

---

## License

MIT © 2026 [Shantanu Bose](https://www.linkedin.com/in/iamshantanubose)

<div align="center">
Made by <a href="https://www.linkedin.com/in/iamshantanubose">Shantanu Bose</a>
</div>
