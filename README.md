<p align="center">
  <img src="https://raw.githubusercontent.com/lucascordone-spec/santa-rosa/main/assets/banner.png" alt="Santa Rosa Protocol" width="100%" onerror="this.style.display='none'"/>
</p>

# ⚡ Santa Rosa Protocol
### Headless DeFi Infrastructure, Anti-Liquidation Engine & MCP Gateway on Base L2

<p align="center">
  <a href="https://base.org"><img src="https://img.shields.io/badge/Base_L2-ChainId_8453-0052FF?style=for-the-badge&logo=coinbase&logoColor=white" alt="Base L2" /></a>
  <a href="https://morpho.org"><img src="https://img.shields.io/badge/Morpho_Blue-0.00%25_Fee_Flash_Loans-2458f5?style=for-the-badge&logo=ethereum&logoColor=white" alt="Morpho Blue 0% Fee" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP_Protocol-2024--11--05-4A154B?style=for-the-badge&logo=anthropic&logoColor=white" alt="MCP Server" /></a>
  <a href="https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57"><img src="https://img.shields.io/badge/BaseScan-Contract_Verified-00D1B2?style=for-the-badge&logo=ethereum&logoColor=white" alt="BaseScan Verified" /></a>
  <a href="https://github.com/foundry-rs/foundry"><img src="https://img.shields.io/badge/Foundry-Tests_Passed-brightgreen?style=for-the-badge&logo=solidity&logoColor=white" alt="Foundry Passed" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" /></a>
</p>

---

## 🌐 Live Public Endpoints & Official Base L2 Bridges (Puente Oficial)

Connect remote AI agents, bots, and applications directly over HTTPS:

| Service | Public Endpoint / Puente | Protocol | Description |
| :--- | :--- | :---: | :--- |
| **Puente MCP Gateway** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`](https://sunset-determining-budget-deluxe.trycloudflare.com/mcp) | JSON-RPC 2.0 | Native Model Context Protocol tools for AI agents. |
| **Puente Health & Telemetry API** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/health`](https://sunset-determining-budget-deluxe.trycloudflare.com/health) | REST | Live Base L2 network and contract status. |
| **Operations Live Dashboard** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/`](https://sunset-determining-budget-deluxe.trycloudflare.com/) | Web / SSE | Real-time telemetry feed and agent transaction monitor. |

### 🌉 Base L2 On-Chain Bridge Addresses (Puente Oficial)
For bridging cross-chain collateral and settlement into Base:
* **Base L2 Standard Bridge (L2):** [`0x4200000000000000000000000000000000000010`](https://basescan.org/address/0x4200000000000000000000000000000000000010)
* **Base Portal Bridge (Ethereum L1):** [`0x49048044D57e1C92A77f79988d21Fa8fAF74E97e`](https://etherscan.io/address/0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)

---

## 📍 Deployed Contracts (Base Mainnet — ChainId: 8453)

* **Santa Rosa Router:** [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
* **Protocol Treasury:** [`0x8f7670EA615910D0A86320e84A611577F68E3908`](https://basescan.org/address/0x8f7670EA615910D0A86320e84A611577F68E3908)
* **Flash Loan Liquidity:** Morpho Blue (0.00% fee — $160M+ USDC liquidity)

---

## 💡 What is Santa Rosa Protocol?

**Santa Rosa Protocol** is an autonomous, non-custodial Machine-to-Machine (M2M) execution framework built on **Base L2**. It bridges complex on-chain DeFi operations directly into LLM agent environments via the **Model Context Protocol (MCP)**.

When a borrower's loan approaches liquidation on **Morpho Blue** or **Aave v3**, external liquidators seize collateral and penalize the borrower **5.00%**. Santa Rosa executes an atomic, gasless simulation and instantaneous **Debt Rescue** using **0.00% fee Morpho Blue flash loans**, charging only **0.25%** flat fee.

Borrowers save **~95% of their penalized capital (20.0x cheaper)**, while the referring AI agent or builder receives an instant **0.05% builder revenue share paid in USDC in the exact same transaction block**.

---

## 📊 The 20x Cost Breakthrough (Mathematical Comparison)

| User Rescued Debt (USD) | External MEV Penalty (5.00%) | Santa Rosa Rescue Fee (0.25%) | 🛡️ Net Capital Saved by User | 💸 Builder Rev-Share (0.05% in USDC) |
| :---: | :---: | :---: | :---: | :---: |
| **$10,000** | $500.00 | $25.00 | **$475.00 (20.0x cheaper)** | **$5.00 USDC** |
| **$50,000** | $2,500.00 | $125.00 | **$2,375.00 (20.0x cheaper)** | **$25.00 USDC** |
| **$100,000** | $5,000.00 | $250.00 | **$4,750.00 (20.0x cheaper)** | **$50.00 USDC** |
| **$500,000** | $25,000.00 | $1,250.00 | **$23,750.00 (20.0x cheaper)** | **$250.00 USDC** |
| **$1,000,000** | $50,000.00 | $2,500.00 | **$47,500.00 (20.0x cheaper)** | **$500.00 USDC** |

---

## 🏗️ Architecture & Execution Flow

```mermaid
flowchart TD
    subgraph Clients["Agents & Builders"]
        C1["Claude Desktop"]
        C2["Cursor IDE"]
        C3["Coinbase AgentKit"]
        C4["ElizaOS Agent"]
        C5["Sentinel Keeper Bot"]
    end

    subgraph Gateway["Public Gateway"]
        MCP["Puente MCP Gateway (JSON-RPC 2.0)\n/mcp"]
        REST["REST API & Health\n/health & /v1/simulate"]
    end

    subgraph OnChain["Base Mainnet (8453)"]
        Router["FlashShiftRouter Contract\n0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57"]
        MorphoFlash["Morpho Blue Flash Loan\n(0.00% Fee)"]
        Lending["Morpho Blue / Aave v3\n(Debt Repayment & Collateral Release)"]
        PMM["KyberSwap / Private Market Makers\n(Zero Price Impact Swap)"]
        Treasury["Treasury (80%)\n0x8f76...3908"]
        Builder["Builder Payout (20%)\n(0.05% Volume in USDC)"]
    end

    Clients -->|Remote MCP / HTTP| Gateway
    Gateway -->|Calldata| Router
    Router -->|1. Borrow USDC (0% fee)| MorphoFlash
    MorphoFlash -->|2. Callback| Router
    Router -->|3. Repay Debt| Lending
    Lending -->|4. Release Collateral| Router
    Router -->|5. Swap Collateral| PMM
    Router -->|6. Repay Flash Loan| MorphoFlash
    Router -->|7a. Protocol Fee (0.20%)| Treasury
    Router -->|7b. Instant Builder Reward (0.05%)| Builder
```

---

## 🤝 Builder Revenue Share Program (5 bps Instant USDC)

Any referring wallet, agent, or bot earns **0.05% (5 bps)** of rescued volume in USDC. The fee is distributed **atomically on-chain in the same transaction block** via smart contract.

### Smart Contract Execution Logic (`FlashShiftRouter.sol`):
```solidity
// Split total 0.25% fee (25 bps) into:
// - Protocol Treasury: 20 bps (80%)
// - Builder / Referrer:  5 bps (20% of fee = 0.05% of volume in USDC)
uint256 builderFee = (amount * RESCUE_BUILDER_BPS) / BPS_DENOMINATOR;
uint256 protocolFee = (amount * RESCUE_PROTOCOL_BPS) / BPS_DENOMINATOR;

IERC20(loanToken).safeTransfer(treasury, protocolFee);
if (builder != address(0) && builderFee > 0) {
    IERC20(loanToken).safeTransfer(builder, builderFee);
}
```

### REST API Integration Example:
```bash
curl -X POST https://sunset-determining-budget-deluxe.trycloudflare.com/v1/simulate/rescue \
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

## 🤖 1-Click AI Agent Integration (MCP)

Santa Rosa exposes a fully managed remote MCP gateway. External agents connect in seconds without running local servers.

### 1. Claude Desktop (3 Steps)
1. **1-Click Install via Smithery:**
   ```bash
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client claude
   ```
2. **Or edit `claude_desktop_config.json`:**
   ```json
   {
     "mcpServers": {
       "santa-rosa": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"],
         "env": {
           "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere"
         }
       }
     }
   }
   ```
3. Restart Claude Desktop and start scanning/rescuing Base positions!

### 2. Cursor IDE (3 Steps)
1. **1-Click Install via Smithery:**
   ```bash
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client cursor
   ```
2. **Or configure `.cursor/mcp.json`:**
   ```json
   {
     "mcpServers": {
       "santa-rosa": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"],
         "env": {
           "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere"
         }
       }
     }
   }
   ```
3. Ask Cursor Composer to simulate debt rescue plans or generate Base transactions.

### 3. Coinbase AgentKit (3 Steps)
1. **Install Action Provider:**
   ```bash
   npm install @santa-rosa/agentkit-action-provider @coinbase/agentkit viem zod
   ```
2. **Initialize Provider:**
   ```typescript
   import { AgentKit } from "@coinbase/agentkit";
   import { santaRosaActionProvider } from "@santa-rosa/agentkit-action-provider";

   const agentKit = await AgentKit.from({
     actionProviders: [
       santaRosaActionProvider({
         partnerWallet: "0xYourBaseAddressHere" // Earns 0.05% in USDC
       })
     ]
   });
   ```
3. Run your autonomous agent script: `npx ts-node example-agent.ts`.

### 4. ElizaOS Plugin (3 Steps)
1. **Install Plugin:**
   ```bash
   npm install @santa-rosa/plugin-elizaos @elizaos/core viem zod
   ```
2. **Add to `character.json`:**
   ```json
   {
     "name": "DeFi Guardian",
     "plugins": ["@santa-rosa/plugin-elizaos"],
     "settings": {
       "secrets": {
         "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere",
         "SANTA_ROSA_GATEWAY_URL": "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"
       }
     }
   }
   ```
3. Run ElizaOS: your character can now monitor and defend vaults autonomously.

### 5. Sentinel Keeper Bot
```bash
# Dry run scan
node packages/sentinel-keeper/sentinel.mjs --dry-run

# 10s polling monitor
node packages/sentinel-keeper/sentinel.mjs --poll --interval 10
```

---

## 🛠️ Available MCP Tools

1. `get_user_debt_positions`: Scans active borrow/collateral positions in Morpho Blue & Aave v3 on Base L2.
2. `simulate_rescue_savings`: Gasless mathematical simulation proving 20x cheaper rescue vs. 5.00% MEV liquidation penalties and computing builder revenue.
3. `quote_debt_rescue`: Generates quote with 0.25% fee (80% Protocol / 20% Builder) with 0.00% Morpho flash loan fee.
4. `quote_leverage_multiply`: Generates 1-click leverage multiply plan (3x–5x) with 0.10% fee.
5. `build_rescue_transaction`: Returns ready-to-sign EVM calldata targeting the Santa Rosa Base Router (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`).

---

## 🧪 Testing & Verification

### Smart Contracts (Foundry)
```bash
cd contracts
forge test --match-path test/FlashShiftRouter.t.sol -vvv
```

### TypeScript Packages & Workspaces
```bash
npm install
npm run build
```

---

## 🤝 Contributing & Security

* **Contributing Guidelines**: [CONTRIBUTING.md](CONTRIBUTING.md)
* **Security & Responsible Disclosure**: [SECURITY.md](SECURITY.md)
* **Awesome MCP Pull Request Template**: [docs/pull_request_awesome_mcp.md](docs/pull_request_awesome_mcp.md)
* **Social Distribution Kit**: [docs/github_launch_kit.md](docs/github_launch_kit.md)

---

## 📄 License & Terms
This project is open-source under the [MIT License](LICENSE).
