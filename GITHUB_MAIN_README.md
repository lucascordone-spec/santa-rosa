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

## 🌐 Live Public Endpoints & On-Chain Addresses

Connect remote AI agents, trading bots, and applications directly over HTTPS:

| Service | Public Endpoint / Identifier | Protocol | Status |
| :--- | :--- | :---: | :---: |
| **Puente MCP Gateway** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`](https://sunset-determining-budget-deluxe.trycloudflare.com/mcp) | JSON-RPC 2.0 | 🟢 **LIVE** |
| **REST Health & Telemetry API** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/health`](https://sunset-determining-budget-deluxe.trycloudflare.com/health) | REST HTTP | 🟢 **LIVE** |
| **Operations Live Dashboard** | [`https://sunset-determining-budget-deluxe.trycloudflare.com/`](https://sunset-determining-budget-deluxe.trycloudflare.com/) | Web / SSE | 🟢 **LIVE** |
| **Santa Rosa Router (Base L2)** | [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57) | EVM Cancun | 🟢 **VERIFIED** |
| **Protocol Treasury** | [`0x8f7670EA615910D0A86320e84A611577F68E3908`](https://basescan.org/address/0x8f7670EA615910D0A86320e84A611577F68E3908) | Multi-Sig / Cold | 🟢 **ACTIVE** |

### 🌉 Official Base L2 Cross-Chain Bridges
* **Base Standard Bridge (L2):** [`0x4200000000000000000000000000000000000010`](https://basescan.org/address/0x4200000000000000000000000000000000000010)
* **Base Portal Bridge (Ethereum L1):** [`0x49048044D57e1C92A77f79988d21Fa8fAF74E97e`](https://etherscan.io/address/0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)

---

## 💡 What is Santa Rosa Protocol?

**Santa Rosa Protocol** is an autonomous, non-custodial Machine-to-Machine (M2M) execution framework built on **Base L2**. It turns complex DeFi financial operations into native AI agent actions via the **Model Context Protocol (MCP)**.

When a borrower's collateral drops near liquidation thresholds on **Morpho Blue** or **Aave v3**, predatory MEV bots seize collateral and penalize the borrower **5.00%**. Santa Rosa executes an atomic, gas-efficient **Debt Rescue** using **0.00% fee Morpho Blue flash loans**, charging only **0.25%** flat fee.

Borrowers save **~95% of their penalized capital (20.0x cheaper)**, while the referring AI agent or builder receives an instant **0.05% builder revenue share paid in USDC in the exact same transaction block**.

---

## 📊 The 20x Cost Breakthrough (Mathematical Comparison)

Standard MEV liquidations inflict devastating penalties on borrowers. Santa Rosa replaces adversarial liquidation with cooperative deleveraging:

| User Rescued Debt (USD) | External MEV Penalty (5.00%) | Santa Rosa Rescue Fee (0.25%) | 🛡️ Net Capital Saved by User | 💸 Builder Rev-Share (0.05% in USDC) |
| :---: | :---: | :---: | :---: | :---: |
| **$10,000** | $500.00 | $25.00 | **$475.00 (20.0x cheaper)** | **$5.00 USDC** |
| **$50,000** | $2,500.00 | $125.00 | **$2,375.00 (20.0x cheaper)** | **$25.00 USDC** |
| **$100,000** | $5,000.00 | $250.00 | **$4,750.00 (20.0x cheaper)** | **$50.00 USDC** |
| **$500,000** | $25,000.00 | $1,250.00 | **$23,750.00 (20.0x cheaper)** | **$250.00 USDC** |
| **$1,000,000** | $50,000.00 | $2,500.00 | **$47,500.00 (20.0x cheaper)** | **$500.00 USDC** |

> [!IMPORTANT]
> **Key Metric**: Users save **$4,750 USD per $100k rescued**. The builder earns **$50.00 USDC per $100k rescued** atomically in the same block.

---

## 🏗️ Architecture & Execution Flow

```mermaid
flowchart TD
    subgraph Agents["Autonomous AI Agents & Clients"]
        A1["Claude Desktop"]
        A2["Cursor IDE"]
        A3["Coinbase AgentKit"]
        A4["ElizaOS Agent"]
        A5["Sentinel Keeper Bot"]
    end

    subgraph Gateway["Santa Rosa Gateway"]
        MCP["Puente Remote MCP Gateway\n(JSON-RPC 2.0 /tools/list)"]
        REST["REST API & Telemetry Stream\n(/v1/simulate/rescue)"]
    end

    subgraph BaseL2["Base L2 Mainnet (ChainId: 8453)"]
        Router["FlashShiftRouter Contract\n0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57"]
        MorphoFlash["Morpho Blue Flash Loan\n(0.00% Fee — $160M+ Liquidity)"]
        Lending["Morpho Blue & Aave v3\n(Debt Repayment & Collateral Release)"]
        PMM["KyberSwap / Private Market Makers\n(Low-Slippage Collateral Swap)"]
        Treasury["Protocol Treasury (80%)\n0x8f76...3908"]
        Builder["Builder Payout Wallet (20%)\n(0.05% Volume in USDC)"]
    end

    Agents -->|Remote MCP / HTTP| Gateway
    Gateway -->|Calldata Payload| Router
    Router -->|1. Borrow USDC (0% fee)| MorphoFlash
    MorphoFlash -->|2. onMorphoFlashLoan Callback| Router
    Router -->|3. Repay Borrow Debt| Lending
    Lending -->|4. Withdraw Released Collateral| Router
    Router -->|5. Swap Collateral for USDC| PMM
    Router -->|6. Repay Flash Loan| MorphoFlash
    Router -->|7a. Protocol Fee (0.20%)| Treasury
    Router -->|7b. Instant Builder Reward (0.05%)| Builder
```

---

## 💰 Builder Revenue Share: Earn 0.05% in USDC Instantly

Every integration of Santa Rosa Protocol includes an on-chain builder incentive:

* **Protocol Fee**: 0.25% flat fee on debt rescued.
* **Builder Revenue Share**: **0.05% of volume (20% of protocol fee)** transferred on-chain via `safeTransfer` in USDC in the **exact same execution block**.
* **Zero Registration / KYC**: No API keys, accounts, or approvals required. Pass your EVM address in the `referralAddress` or `SANTA_ROSA_PARTNER_WALLET` parameter.

### Smart Contract Execution Logic (`FlashShiftRouter.sol`):
```solidity
// Split total 0.25% fee (25 bps) into:
// - Protocol Treasury: 20 bps (80%)
// - Builder / Referrer:  5 bps (20% of fee = 0.05% of rescued volume)
uint256 builderFee = (amount * RESCUE_BUILDER_BPS) / BPS_DENOMINATOR;
uint256 protocolFee = (amount * RESCUE_PROTOCOL_BPS) / BPS_DENOMINATOR;

IERC20(loanToken).safeTransfer(treasury, protocolFee);
if (builder != address(0) && builderFee > 0) {
    IERC20(loanToken).safeTransfer(builder, builderFee);
}
```

---

## ⚡ 1-Click Quickstart Integrations

### 1. Claude Desktop (3 Steps)

1. **Install via Smithery CLI:**
   ```bash
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client claude
   ```
2. **Or Add to `claude_desktop_config.json` manually:**
   * **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   * **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   ```json
   {
     "mcpServers": {
       "santa-rosa": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"],
         "env": {
           "SANTA_ROSA_PARTNER_WALLET": "0xYourBasePayoutWalletAddress"
         }
       }
     }
   }
   ```
3. **Prompt Claude:**
   > *"Revisa las posiciones de deuda en Base de la wallet `0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c` y simula cuánto dinero ahorra si rescatamos su posición."*

---

### 2. Cursor IDE (3 Steps)

1. **Install via Smithery CLI:**
   ```bash
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client cursor
   ```
2. **Or configure `.cursor/mcp.json` in your workspace:**
   ```json
   {
     "mcpServers": {
       "santa-rosa": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"],
         "env": {
           "SANTA_ROSA_PARTNER_WALLET": "0xYourBasePayoutWalletAddress"
         }
       }
     }
   }
   ```
3. **Use Composer (Cmd+I / Ctrl+I) to inspect vaults or generate router calldata.**

---

### 3. Coinbase AgentKit (3 Steps)

1. **Install the Action Provider:**
   ```bash
   npm install @santa-rosa/agentkit-action-provider @coinbase/agentkit viem zod
   ```
2. **Register with AgentKit:**
   ```typescript
   import { AgentKit } from "@coinbase/agentkit";
   import { santaRosaActionProvider } from "@santa-rosa/agentkit-action-provider";

   const agentKit = await AgentKit.from({
     actionProviders: [
       santaRosaActionProvider({
         partnerWallet: "0xYourBasePayoutWalletAddress" // Earns 0.05% in USDC
       })
     ]
   });
   ```
3. **Run Autonomous Cycle:**
   ```bash
   npx ts-node example-agent.ts
   ```

---

### 4. ElizaOS Plugin (3 Steps)

1. **Install the Plugin:**
   ```bash
   npm install @santa-rosa/plugin-elizaos @elizaos/core viem zod
   ```
2. **Configure in `character.json`:**
   ```json
   {
     "name": "DeFi Guardian",
     "plugins": ["@santa-rosa/plugin-elizaos"],
     "settings": {
       "secrets": {
         "SANTA_ROSA_PARTNER_WALLET": "0xYourBasePayoutWalletAddress",
         "SANTA_ROSA_GATEWAY_URL": "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"
       }
     }
   }
   ```
3. **Interact with your Eliza Agent:**
   > *"Simula el rescate de mi posición de $100,000 en Morpho Blue y calcula el rev-share."*

---

### 5. Autonomous Sentinel Keeper Bot

Run a dedicated MEV-resistant anti-liquidation monitor directly on Base L2:

```bash
# Dry run scan (scans top borrow positions without broadcasting transactions)
node packages/sentinel-keeper/sentinel.mjs --dry-run

# Continuous polling keeper bot (checks every 10 seconds)
node packages/sentinel-keeper/sentinel.mjs --poll --interval 10
```

---

## 🛠️ MCP Tools Reference (Model Context Protocol)

The Santa Rosa MCP Server exposes 5 high-throughput DeFi tools:

| Tool | Parameters | Description |
| :--- | :--- | :--- |
| `get_user_debt_positions` | `userAddress: string` | Scans active borrow/collateral positions on Base across Morpho Blue & Aave v3. Returns collateral USD, debt USD, borrow APY, and Health Factor. |
| `simulate_rescue_savings` | `userAddress`, `currentDebtUsd`, `currentCollateralUsd`, `debtToRepayUsd`, `referralAddress?` | Gasless simulation (`eth_call`) on Base. Calculates net dollars saved vs. 5% liquidation penalty and computes 0.05% builder revenue share. |
| `quote_debt_rescue` | `borrowedAmountUsd`, `referralAddress?` | Computes 0.25% fee breakdown for debt rescue and deleveraging with 0.00% Morpho Blue flash loans. |
| `quote_leverage_multiply` | `flashLoanAmountUsd`, `leverageMultiplier`, `referralAddress?` | Computes 1-click leverage multiply plan (0.10% fee flat, 0.02% builder rev-share) powered by Morpho Blue flash loans. |
| `build_rescue_transaction` | `protocol`, `loanToken`, `amount`, `referralAddress?` | Generates execution calldata targeting the deployed Base Mainnet Router (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`). |

---

## 📦 Monorepo Structure

```text
santa-rosa/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Foundry & TypeScript automated CI
│       └── gateway-healthcheck.yml    # Cron health audit of remote MCP gateway
├── contracts/
│   ├── src/FlashShiftRouter.sol       # Deployed Base L2 Router contract
│   ├── test/FlashShiftRouter.t.sol   # Foundry unit & invariant security tests
│   └── foundry.toml                   # Cancun EVM compiler configuration
├── packages/
│   ├── core/                          # Pure calculation engine & viem bindings
│   ├── api/                           # Express REST API & telemetry stream
│   ├── mcp-server/                    # Model Context Protocol remote JSON-RPC server
│   ├── partner-agent/                 # Automated B2B outreach & partner engine
│   ├── sentinel-keeper/               # Volume sentinel & anti-liquidation keeper bot
│   └── integrations/
│       ├── claude-cursor/             # Ready-to-use Claude & Cursor configs
│       ├── coinbase-agentkit/         # Official Coinbase AgentKit Action Provider
│       └── elizaos-plugin/            # Official ElizaOS Plugin
└── docs/
    ├── pull_request_awesome_mcp.md    # PR templates for MCP registries
    ├── github_launch_kit.md           # Twitter, Farcaster & Reddit distribution copy
    └── guia_publicacion_directorios_mcp.md # Multi-directory registration manual
```

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

* **Contributing**: Review our [CONTRIBUTING.md](file:///c:/Users/Lucas/OneDrive/Escritorio/lcf/Nueva%20carpeta/CONTRIBUTING.md) for coding standards, pull request processes, and conventions.
* **Security & Bug Bounty**: Review our [SECURITY.md](file:///c:/Users/Lucas/OneDrive/Escritorio/lcf/Nueva%20carpeta/SECURITY.md) for disclosure guidelines and bounty rewards up to $25,000 USD.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
