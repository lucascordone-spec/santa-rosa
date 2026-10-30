# 🤝 Santa Rosa Protocol — Partner Outreach Kit

> **Target Audience:** Core Devs & BD Leads at **Cielo Finance**, **EtherDrops**, and **Maestro Bots**.  
> **Value Proposition:** Convert passive liquidation alerts into high-margin monetization. Earn **0.05% (5 bps)** in instant USDC commissions by offering your users a 1-click atomic debt rescue that saves them **~95%** vs. MEV liquidator penalties.  
> **Deployed Infrastructure:** Base Mainnet Router `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` | 0% Fee Morpho Blue Flash Loans.

---

## 📌 Executive Summary for Bot & Alert Integrators

Currently, alert bots send passive notifications:  
`⚠️ Warning: Your Base Morpho position is at HF 1.03! Risk of liquidation in <1 hour.`

Borrowers panic, rush to a desktop DEX, suffer slippage, or worse—get frontrun and liquidated by MEV bots seizing a **5.00% liquidation penalty**.

### The Santa Rosa Upgrade:
With Santa Rosa Protocol, your bot provides an actionable **1-Click Rescue**:
* **Morpho Blue 0.00% Flash Loan** borrows the exact debt needed with zero capital cost.
* Repays the debt and unlocks collateral atomically in a single block.
* Charges a flat **0.25% fee** (saving the borrower 95% of the penalty).
* **Automatically sends 20% of the fee (0.05% / 5 bps of total volume) directly to your bot's payout wallet** in the exact same transaction block via `safeTransfer`.

---

## 1️⃣ Outreach Package for Cielo Finance (`@cielofinance`)

### Context
Cielo tracks whale wallets and DeFi positions. Cielo's users are active on-chain whales who frequently monitor liquidation alerts on Base.

### Direct Message Copy (Telegram / Discord / Twitter DM)
```markdown
Hey Cielo team! 👋

Big fans of Cielo's feed and wallet tracking on Base L2. We noticed Cielo tracks thousands of active borrowers on Morpho Blue and Aave v3 on Base.

Right now, our live scanner on Base detected **$5.91M+ in whale debt sitting below Health Factor 1.05** across 44 wallets (including a single $1.04M wstETH whale at HF 1.038: `0xC955793F9a7572ED31D62ebfb25b933aa3e1283e`).

If those positions get liquidated by MEV bots, those borrowers lose **$295,000+** in 5% liquidation penalties.

We built **Santa Rosa Protocol** (Router deployed on Base: `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`), powered by Morpho's 0% fee flash loans. It rescues at-risk debt in 1 atomic block for a flat 0.25% fee—saving users 95% vs liquidation.

**Here's the win-win for Cielo:**
Instead of sending a passive alert, Cielo can append a 1-click "Rescue Position" button. 
* Your user saves **$49,400+** on a $1M rescue.
* **Cielo earns 5 bps ($520 USDC) instantly on-chain** in the same block, credited straight to your treasury wallet via our smart contract.

Zero contract risk on your side—we provide a ready REST endpoint, TypeScript SDK, or remote MCP tool.

Would love to send over the 3-line curl snippet or jump on a quick 10-min chat with your dev team to test it on Base!
```

---

## 2️⃣ Outreach Package for EtherDrops (`@etherdrops_bot`)

### Context
EtherDrops is the leading Telegram notification bot for EVM wallet balance drops, swaps, and liquidation thresholds.

### Direct Message Copy (Telegram / Email / Discord)
```markdown
Hello EtherDrops team! 🚀

Quick question for your Base L2 integration lead: 
Would EtherDrops be interested in monetizing liquidation alerts on Base with zero user churn?

Currently on Base L2 Morpho Blue, there is **$5.91 Million USD in whale debt at imminent liquidation risk (HF < 1.05)**. When EtherDrops fires an alert like "Position HF < 1.05", the user either gets liquidated (paying 5% MEV penalty) or scrambles to manual DEXes.

With **Santa Rosa Protocol** (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`), you can include an inline Telegram button: 
👉 `[🛡️ Rescue Position (Save 95% Penalty)]`

**The Economics for EtherDrops:**
* **Borrower saves:** 95.2% vs MEV liquidators (0.25% flat fee vs 5.00% penalty).
* **EtherDrops earns:** **0.05% (5 bps)** of the total debt rescued, sent directly to your partner wallet atomically in the block via `safeTransfer`.
* For a $200k position rescue, EtherDrops earns **$100 USDC** immediately.

Integration takes less than 30 minutes: you simply pass `referralAddress: "0xEtherDropsTreasury"` into our `/v1/build-tx` endpoint or remote MCP tool.

Can we set up a dedicated test link and referral address for EtherDrops on Base?
```

---

## 3️⃣ Outreach Package for Maestro Bots (`@MaestroBots`)

### Context
Maestro is the premier Telegram trading bot with immense volume. Expanding into automated DeFi protection and deleveraging is an immediate new revenue vertical.

### Direct Message Copy (Telegram / Twitter DM)
```markdown
Hey Maestro team! ⚡

Maestro dominates DEX execution on Telegram. We have an immediate new revenue stream for Maestro users on Base L2: **Automated Anti-Liquidation Debt Rescue & 1-Click Multiply**.

Morpho Blue Base currently holds over **$160M in USDC liquidity at 0.00% flash loan cost**, but over **$5.9M in whale debt is hovering at HF 1.00 - 1.04**, minutes away from MEV liquidations.

We launched Santa Rosa Protocol (Base Mainnet Router: `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`).
Our contracts let any bot trigger or sign atomic debt deleveraging:
1. Flash borrow from Morpho Blue (0% fee).
2. Repay loan token, withdraw collateral, swap minimum fraction.
3. User HF resets to >1.50 safely without full liquidation loss.

**Revenue Share:**
Every rescue or multiply action routes **20% of protocol fees (5 bps of total volume)** directly to Maestro's fee recipient address. 

A single whale rescue of $1M yields **$520 USDC** instantly for Maestro, while handing your user a **$49,000+** net saving.

Our API and Remote MCP Server are fully live on Base L2 with zero rate-limiting. Check the endpoint:
`https://rates-counter-breed-frontier.trycloudflare.com/health`

Let's sync to get Maestro's referral address integrated into our router!
```

---

## 💻 Technical Integration Cheat-Sheet for Partners

Partners can integrate using three distinct mechanisms depending on their architecture:

### 1. REST API (For Webhooks & Telegram Bots)

#### Step 1: Pre-flight Simulation & Quote
```bash
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/simulate/rescue \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xC955793F9a7572ED31D62ebfb25b933aa3e1283e",
    "currentDebtUsd": 1039217,
    "currentCollateralUsd": 1140417,
    "debtToRepayUsd": 1039217,
    "referralAddress": "0xYourPartnerPayoutWalletHere"
  }'
```
**Response Preview:**
```json
{
  "financialComparison": {
    "liquidationPenaltyIfLiquidatedUsd": 51960.88,
    "flashShiftFeeUsd": 2598.04,
    "builderFeeUsd": 519.61,
    "protocolFeeUsd": 2078.43,
    "netMoneySavedUsd": 49362.84,
    "savingsMultiplier": "20.0x cheaper than liquidation"
  }
}
```

#### Step 2: Build Executable Calldata
```bash
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/build-tx \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "RESCUE",
    "protocol": "MORPHO",
    "loanToken": "0x4200000000000000000000000000000000000006",
    "amount": 1039217,
    "referralAddress": "0xYourPartnerPayoutWalletHere"
  }'
```

---

### 2. Model Context Protocol (MCP) (For Autonomous AI Agents)
Connect Claude, Cursor, or your autonomous agent directly:
* **Remote MCP URL:** `https://rates-counter-breed-frontier.trycloudflare.com/mcp`
* **Transport:** Streamable JSON-RPC 2.0 over HTTPS
* **Supported Tools:**
  * `get_user_debt_positions`: Discover active positions and health factors.
  * `simulate_rescue_savings`: Compute exact dollars saved and partner commission.
  * `quote_debt_rescue`: Quote atomic fees with 80/20 referral split.
  * `build_rescue_transaction`: Return signed EVM execution data.

---

### 3. Smart Contract Direct Call (On-Chain)
* **Router Contract:** `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` on Base Mainnet (8453).
* **Solidity Callback Signature:**
```solidity
function executeRescue(
    address borrower,
    address loanToken,
    uint256 debtToRepay,
    address partnerReferral
) external returns (uint256 partnerFeePaidUsd);
```
On completion of the Morpho Blue flash loan callback, `safeTransfer` immediately pushes 5 bps of the borrowed token to `partnerReferral`.

---
*Authored by Santa Rosa Growth & Indexing Lead | Base L2 Operations.*
