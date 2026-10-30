# ⚡ Santa Rosa Protocol

> **Headless Non-Custodial DeFi Infrastructure for Autonomous Debt Rescue, 1-Click Leverage, and Multi-Route Arbitrage on Base L2 (ChainId: 8453).**

---

## 📌 Protocol Overview

Santa Rosa is a machine-to-machine (M2M) decentralized execution router designed specifically for **AI Agents, Web3 Wallets, and Automated Bots** operating on Base L2.

* **0.00% Flash Loan Fee:** Powered exclusively by Morpho Blue flash loans (`$162.1M+` USDC liquidity available at zero borrow cost).
* **Anti-Liquidation Debt Rescue:** Repays at-risk debt, releases locked collateral, and swaps the minimum required fraction in a single atomic transaction block—saving borrowers ~95% vs. external liquidator penalties (0.25% flat fee vs. 5.00% MEV penalty).
* **On-Chain Builder Revenue Share (80/20):** 
  * **80%** to Santa Rosa Protocol Treasury (`0.20%`).
  * **20%** to the referring Partner / Bot Wallet (`0.05%`), transferred **atomically in the same block** via `safeTransfer`.

---

## 📍 Deployed Contracts (Base Mainnet)

| Contract | Address | Explorer Link |
| :--- | :--- | :--- |
| **Santa Rosa Router** | `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` | [BaseScan](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57) |
| **Protocol Treasury** | `0x8f7670EA615910D0A86320e84A611577F68E3908` | [BaseScan](https://basescan.org/address/0x8f7670EA615910D0A86320e84A611577F68E3908) |
| **Morpho Blue (Flash Loan)** | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | [BaseScan](https://basescan.org/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) |
| **Aave v3 Pool (Base)** | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` | [BaseScan](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5) |
| **Kyber Meta-Router** | `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` | [BaseScan](https://basescan.org/address/0x6131B5fae19EA4f9D964eAc0408E4408b66337b5) |

---

## 🌐 Public Live Endpoints (Cloudflare SSL Bridge)

Remote AI agents, bots, and external integrators can connect directly to Santa Rosa over the public internet without local installations:

| Service | Public URL | Description |
| :--- | :--- | :--- |
| **Remote MCP Endpoint** | `https://rates-counter-breed-frontier.trycloudflare.com/mcp` | Remote JSON-RPC 2.0 MCP server for AI agents. |
| **Live Ops & Telemetry Dashboard** | [Dashboard](https://rates-counter-breed-frontier.trycloudflare.com) | Real-time monitoring, live fleet stats & on-chain balances. |
| **Health API** | [Health](https://rates-counter-breed-frontier.trycloudflare.com/health) | Node status, Base L2 connectivity & contracts. |


---

## 🤖 MCP Server for AI Agents (`@santa-rosa/mcp-server`)

Connect autonomous AI agents (Claude Desktop, Cursor, ElizaOS, Coinbase AgentKit) via the Model Context Protocol (MCP).

### Option A: Remote Public MCP (Zero Installation Required)
Connect any agent directly over HTTPS via our Cloudflare bridge:
```json
{
  "mcpServers": {
    "santa-rosa": {
      "url": "https://rates-counter-breed-frontier.trycloudflare.com/mcp"
    }
  }
}
```

### Option B: Local Stdio MCP (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "santa-rosa": {
      "command": "node",
      "args": ["/path/to/santa-rosa/packages/mcp-server/dist/index.js"],
      "env": {
        "SANTA_ROSA_PARTNER_WALLET": "0xYourPartnerPayoutWalletHere"
      }
    }
  }
}
```

### Native Tools Exposed:
1. `get_user_debt_positions`: Scans borrowing positions in Morpho Blue & Aave v3 on Base L2.
2. `simulate_rescue_savings`: Simulates net savings vs. 5% liquidation penalty and computes partner revenue.
3. `quote_debt_rescue`: Generates quote with 80/20 fee distribution.
4. `quote_leverage_multiply`: Generates 1-click leverage plan (3x-5x).
5. `build_rescue_transaction`: Returns ready-to-broadcast `{ to, data, value }` targeting `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`.

---

## 🤝 Partner Revenue Share System (Builder Incentive)

Any bot, agent, or wallet can earn **0.05% (5 bps)** of volume in USDC simply by injecting its wallet address in the `referral` field:

```typescript
// Example: Earn 5 bps on every rescue without writing smart contracts
const response = await fetch("http://localhost:3000/v1/build-tx", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    actionType: "RESCUE",
    protocol: "MORPHO",
    loanToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
    amount: 100000, // $100k debt rescued
    referralAddress: "0xYourPartnerWalletAddress" // <--- Receives $50 USDC instantly
  })
});
```

---

## 📦 Monorepo Architecture

```
santa-rosa/
├── contracts/                  # Solidity 0.8.20 (Cancun) Foundry test suite
│   ├── src/FlashShiftRouter.sol # Deployed Router Contract
│   └── test/                   # Fork tests on live Base L2 state ($5M whales tested)
├── packages/
│   ├── core/                   # @santa-rosa/core (Viem math, Morpho GraphQL client)
│   ├── mcp-server/             # @santa-rosa/mcp-server (Model Context Protocol)
│   └── api/                    # @santa-rosa/api (Express REST API & Ops Dashboard)
├── PARTNERS.md                 # Integration manual for partners and bots
└── README.md
```

---

## 🚀 Quickstart

### 1. Install & Build
```bash
npm install
npm run build --workspaces
```

### 2. Start Ops Console & REST API
```bash
cd packages/api
npm start
# Open http://localhost:3000 in your browser to view the real-time Ops Console
```

### 3. Run Foundry On-Chain Tests
```bash
cd contracts
forge test --fork-url https://mainnet.base.org
```

---

## 🛡️ Security & Audits
* **Atomic Execution:** Morpho Blue flash loans enforce strict balance settlement in the same execution block. If slippage or target Health Factor is not satisfied, the EVM reverts 100% of the transaction.
* **Unauthorized Callback Guard:** Strict validation on `onMorphoFlashLoan` ensuring only the official Morpho Blue address can trigger callbacks.
* **Non-Reentrant:** OpenZeppelin-standard reentrancy protection.
