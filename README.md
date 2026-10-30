# ⚡ Santa Rosa Protocol — Headless DeFi API & MCP Gateway

> **Autonomous Machine-to-Machine (M2M) Execution Gateway for AI Agents, Web3 Wallets, and Telegram Bots on Base L2 (ChainId: 8453).**

---

## 🌐 Live Public Endpoints

Connect remote AI agents, bots, and applications directly over HTTPS:

| Service | Public Endpoint | Protocol | Description |
| :--- | :--- | :---: | :--- |
| **Remote MCP Gateway** | `https://rates-counter-breed-frontier.trycloudflare.com/mcp` | JSON-RPC 2.0 | Native Model Context Protocol tools for AI agents. |
| **Live Telemetry Dashboard** | [Dashboard Console](https://rates-counter-breed-frontier.trycloudflare.com/) | Web / HTTPS | Real-time transaction stream and on-chain metrics. |
| **Health API** | [Health Status](https://rates-counter-breed-frontier.trycloudflare.com/health) | REST | Live Base L2 network and contract status. |

---

## 🤖 1-Click AI Agent Integration (MCP)

Santa Rosa exposes a fully managed remote MCP gateway. External agents (Claude Desktop, Cursor, Windsurf, ElizaOS, Coinbase AgentKit) connect in seconds without running local servers.

### Configuration (`claude_desktop_config.json` or Cursor Settings):
```json
{
  "mcpServers": {
    "santa-rosa": {
      "url": "https://rates-counter-breed-frontier.trycloudflare.com/mcp"
    }
  }
}
```

### Available Tools:
1. `get_user_debt_positions`: Scans active borrow/collateral positions in Morpho Blue & Aave v3 on Base L2.
2. `simulate_rescue_savings`: Simulates net borrower savings vs. 5.00% MEV liquidation penalties and computes partner revenue.
3. `quote_debt_rescue`: Generates quote with 0.25% fee (80% Protocol / 20% Partner).
4. `quote_leverage_multiply`: Generates 1-click leverage plan (3x–5x).
5. `build_rescue_transaction`: Returns ready-to-sign `{ to, data, value }` targeting the Santa Rosa Base Router (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`).

---

## 🤝 Partner Revenue Share System (5 bps Instant USDC)

Any referring wallet, agent, or bot earns **0.05% (5 bps)** of rescued volume in USDC. The fee is distributed **atomically on-chain in the same transaction block** via smart contract.

### REST API Integration Example:
```bash
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/simulate/rescue \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c",
    "currentDebtUsd": 41227.81,
    "currentCollateralUsd": 42536.10,
    "debtToRepayUsd": 41227.81,
    "referralAddress": "0xYourPayoutWalletAddress"
  }'
```

### Response:
```json
{
  "summary": "Guaranteed net savings for borrower: $1,958.32 USD avoiding forced liquidation.",
  "simulation": {
    "financialComparison": {
      "liquidationPenaltyIfLiquidatedUsd": 2061.39,
      "santaRosaFeeUsd": 103.07,
      "builderFeeUsd": 20.61,
      "protocolFeeUsd": 82.46,
      "netMoneySavedUsd": 1958.32
    }
  }
}
```

---

## 📍 Deployed Contracts (Base Mainnet — ChainId: 8453)

* **Santa Rosa Router:** [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
* **Protocol Treasury:** [`0x8f7670EA615910D0A86320e84A611577F68E3908`](https://basescan.org/address/0x8f7670EA615910D0A86320e84A611577F68E3908)
* **Flash Loan Liquidity:** Morpho Blue (0.00% fee — $160M+ USDC liquidity)

---

## 📄 License & Terms
All rights reserved. The Santa Rosa routing algorithms and execution engines are hosted and proprietary. Integrations are provided via the public API and MCP gateway.
