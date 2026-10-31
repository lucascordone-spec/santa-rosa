# 🛡️ Santa Rosa / FlashShift — Sentinel Keeper Bot

> **Autonomous Anti-Liquidation Volume Engine & MEV Keeper on Base L2 (ChainId: 8453)**  
> Earn **20% revenue share (5 bps)** on every debt rescue while saving borrowers **~95%** against MEV liquidation penalties, powered by **0.00% fee Morpho Blue Flash Loans**.

---

## ⚡ Executive Summary

Traditional DeFi liquidations extract aggressive 5% to 10% penalties from underwater borrowers, destroying user equity and sending proceeds to private MEV searchers. 

**Santa Rosa / FlashShift** flips this paradigm:
1. **0.00% Fee Flash Loans**: Borrowers' debt is repaid atomically using Morpho Blue flash loans.
2. **Flat 0.25% Total Rescue Fee**: Cheaper by up to 20x vs standard liquidator penalties.
3. **80/20 Builder Revenue Share**: 
   - **0.20% (20 bps)** goes to the Santa Rosa Protocol Treasury.
   - **0.05% (5 bps)** is transferred **directly on-chain in the same transaction block** to the Keeper/Searcher wallet specified in `referral`.
4. **Zero Capital Required**: Keepers don't need millions in liquidity—flash loans supply 100% of the capital atomically. Only standard L2 gas (< $0.05 USD on Base) is required.

---

## 🏗️ Architecture & Flow

```
┌────────────────────────────────────────────────────────┐
│  Morpho Blue Base GraphQL (api.morpho.org)            │
│  - Real-time indexing of all positions on Base L2      │
│  - Filter: 1.0000 <= Health Factor <= 1.0600 & Debt>$1k│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  Sentinel Keeper Bot (packages/sentinel-keeper)        │
│  - Detects critical positions in real-time             │
│  - Interacts with Santa Rosa Remote MCP Gateway        │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌───────────────────────────┐┌───────────────────────────┐
│ MCP: simulate_rescue      ││ MCP: build_rescue_tx      │
│ - Pre-flight eth_call     ││ - Flash loan params       │
│ - Validates HF & savings  ││ - Protocol & token config │
└───────────────────────────┘└───────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  FlashShiftRouter on Base L2 (0xcd4f88bca4e265...)     │
│  - Calls executeAction(...)                            │
│  - Morpho Blue 0.00% Flash Loan                        │
│  - Repays debt & rescues collateral atomically         │
│  - Distributes 0.05% Keeper fee directly to your wallet│
└────────────────────────────────────────────────────────┘
```

---

## 📊 Live Economics Example (Real On-Chain Data)

| Position / Pair | Debt (USD) | 5% Penalty Avoided | FlashShift Fee (0.25%) | 💰 Keeper Profit (0.05%) | 🛡️ User Net Savings |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **wstETH / WETH** | $41,301.46 | $2,065.07 | $103.25 | **$20.65 USDC** | $1,961.82 |
| **yoUSD / USDC** | $4,059.43 | $202.97 | $10.15 | **$2.03 USDC** | $192.82 |
| **weETH / WETH** | $47,488.14 | $2,374.41 | $118.72 | **$23.74 USDC** | $2,255.69 |
| **cbBTC / USDC** | $106,735.92 | $5,336.80 | $266.84 | **$53.37 USDC** | $5,069.96 |
| **USDe / USDC (Whale)** | $28,865,233.74 | $1,443,261.69 | $72,163.08 | **$14,432.62 USDC** | $1,371,098.60 |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** >= 18.0.0 (Native `fetch` and ES Modules support).
- Base L2 RPC access (public `https://mainnet.base.org` is included by default).

### 2. Installation
From the root of the repository or inside `packages/sentinel-keeper`:
```bash
cd packages/sentinel-keeper
npm install
```

### 3. Run a Dry-Run Scan
Inspect current live positions on Base without sending transactions:
```bash
node sentinel.mjs --dry-run
```

Output highlights:
- Discovered at-risk positions on Base Morpho Blue.
- Pre-flight simulation from Santa Rosa MCP Gateway.
- Calculated profit in USD for your wallet.
- Ready-to-sign EVM calldata (`0xe0eb3d95...`).

### 4. Specify Your Referral Wallet
Pass your EVM wallet address to claim the 0.05% builder revenue share:
```bash
node sentinel.mjs --dry-run --referral 0xYourEVMAddressHere
```
*Or set the environment variable:*
```bash
export KEEPER_WALLET="0xYourEVMAddressHere"
node sentinel.mjs --dry-run
```

### 5. Launch the 24/7 Autonomous Keeper Daemon
Run continuous polling to catch positions the moment they enter the 1.0000 – 1.0600 HF threshold:
```bash
node sentinel.mjs --poll --interval 10 --referral 0xYourEVMAddressHere
```

---

## 🛠️ CLI Options Reference

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--dry-run` | Flag | `true` (if not `--poll`) | Run one scan and print calldata without sending txs. |
| `--poll` | Flag | `false` | Run continuous polling daemon mode. |
| `--interval <sec>` | Number | `15` | Polling interval in seconds. |
| `--referral <address>`| String | Treasury fallback | Address to receive the 0.05% fee directly in the block. |
| `--min-debt <usd>` | Number | `1000` | Minimum debt threshold in USD to filter positions. |
| `--min-hf <value>` | Number | `1.0000` | Minimum Health Factor threshold. |
| `--max-hf <value>` | Number | `1.0600` | Maximum Health Factor threshold (at-risk zone). |
| `--gateway <url>` | String | Official TryCloudflare | Remote MCP Gateway URL. |

---

## 📡 Gateway MCP Integration

The Keeper automatically synchronizes with the public Santa Rosa Model Context Protocol (MCP) Gateway:
- **Public URL**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
- **Protocol**: JSON-RPC 2.0 (`tools/call`)
- **Key Tools**:
  - `simulate_rescue_savings`: Gasless simulation computing exact avoided liquidator penalties and 80/20 fee splits.
  - `build_rescue_transaction`: Returns structural transaction parameters targeting the Base Router.

### Verification of Live MCP Telemetry:
You can verify active keeper agents and real-time transaction streams at:
```bash
curl https://sunset-determining-budget-deluxe.trycloudflare.com/v1/telemetry
```

---

## 🔗 Deployed Contracts & Network Reference

| Parameter | Value |
| :--- | :--- |
| **Network** | Base Mainnet |
| **Chain ID** | `8453` |
| **Router Contract** | `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` |
| **Protocol Treasury**| `0x8f7670EA615910D0A86320e84A611577F68E3908` |
| **Morpho Blue Base** | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF63C3774A464` |
| **USDC (Base L2)** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **WETH (Base L2)** | `0x4200000000000000000000000000000000000006` |

---

## ⚡ Broadcasting On-Chain with Foundry `cast`

Once you identify an at-risk position using `sentinel.mjs --dry-run`, you can broadcast the generated calldata directly to Base L2 using `cast send`:

```bash
cast send 0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57 \
  "$CALLDATA" \
  --rpc-url https://mainnet.base.org \
  --private-key $YOUR_KEEPER_PRIVATE_KEY
```

All logic executes atomically in a single transaction:
1. Morpho Blue initiates 0% fee flash loan.
2. FlashShiftRouter pays off the position.
3. Collateral is freed.
4. Flash loan is returned to Morpho Blue.
5. 0.05% referral fee is transferred directly to your `--referral` wallet.

---

## 🛡️ Security & Invariants
- **Non-custodial**: FlashShiftRouter never holds permanent custody of user or flash loan funds.
- **Atomic Revert**: If target Health Factor or slippage constraints fail, the transaction reverts completely, consuming only minor L2 gas (< $0.05 USD).
- **Callback Authentication**: Only the official Morpho Blue Base contract can invoke `onMorphoFlashLoan`.

---

## 📄 License
MIT © 2026 Santa Rosa Protocol
