# @santa-rosa/agentkit-action-provider

Native [Coinbase AgentKit](https://github.com/coinbase/agentkit) Action Provider for autonomous DeFi debt protection, zero-penalty rescue deleveraging, and 0.00% fee Morpho Blue flash loans on **Base L2 (ChainId: 8453)**.

---

## 💎 The Builder Advantage: 0.05% Revenue Share on Every Execution

Integrating Santa Rosa into your agent doesn't just protect users—it turns your autonomous agent into a revenue-generating machine.

* **Protocol Fee**: 0.25% flat fee on rescued debt.
* **Builder Revenue Share**: **0.05% of volume (20% of protocol fee)** transferred directly to your EVM address in USDC in the exact same execution block.
* **Zero Slippage & Zero Flash Loan Fees**: Executed via Morpho Blue flash loans (0.00% fee).
* **20x Cheaper for Users**: Compared to a standard 5% liquidation penalty, users save **~95%** of their capital.

### Financial Math Example
| Operation | User Rescued | MEV Penalty (5%) | Santa Rosa Fee (0.25%) | Net User Saved | **Builder Rev Share (0.05%)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Whale Rescue** | $100,000 USD | $5,000 | $250 | **$4,750 (20x)** | **$50.00 USDC** |
| **Portfolio Guard**| $500,000 USD | $25,000 | $1,250 | **$23,750 (20x)**| **$250.00 USDC** |
| **Vault Rebalance**| $1,000,000 USD | $50,000 | $2,500 | **$47,500 (20x)**| **$500.00 USDC** |

---

## 🚀 Quickstart Installation

```bash
npm install @santa-rosa/agentkit-action-provider @coinbase/agentkit viem zod
```

---

## 🛠️ Integration with Coinbase AgentKit

```typescript
import { AgentKit } from "@coinbase/agentkit";
import { santaRosaActionProvider } from "@santa-rosa/agentkit-action-provider";

const YOUR_EVM_WALLET = "0xYourBaseAddressHere";

async function createAutonomousDeFiAgent() {
  // 1. Initialize Santa Rosa Action Provider with your payout wallet
  const santaRosa = santaRosaActionProvider({
    partnerWallet: YOUR_EVM_WALLET, // Earns 0.05% in USDC directly on Base
  });

  // 2. Register with Coinbase AgentKit
  const agentKit = await AgentKit.from({
    actionProviders: [
      santaRosa,
      // ...other action providers (e.g. cdpWalletActionProvider)
    ],
  });

  return agentKit;
}
```

---

## 📋 Available Actions

### 1. `get_user_debt_positions`
Scans active lending/collateral positions on Base L2 across Morpho Blue and Aave v3.
* **Input**: `userAddress` (string, EVM address)
* **Returns**: Array of active positions with debt USD, collateral USD, borrow APY, and Health Factor.

### 2. `simulate_rescue_savings`
Gasless mathematical pre-flight simulation on Base. Proves the 20x savings versus a 5% liquidator penalty and calculates your builder revenue share.
* **Inputs**:
  * `userAddress`: EVM address
  * `currentDebtUsd`: number
  * `currentCollateralUsd`: number
  * `debtToRepayUsd`: number
  * `referralAddress`: (optional) your builder wallet
* **Returns**: Before/After Health Factor, dollars saved, and builder rev-share.

### 3. `quote_debt_rescue`
Computes the flat 0.25% fee breakdown for debt rescue and deleveraging.
* **Inputs**: `borrowedAmountUsd`, `referralAddress`

### 4. `quote_leverage_multiply`
Computes 1-click leverage multiply plan (0.10% fee flat, 0.02% builder share) powered by Morpho Blue 0% flash loan.
* **Inputs**: `flashLoanAmountUsd`, `leverageMultiplier`, `referralAddress`

### 5. `build_rescue_transaction`
Generates calldata targeting the deployed **Santa Rosa Router on Base Mainnet** (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`).
* **Inputs**: `protocol` ("MORPHO" | "AAVE"), `loanToken`, `amount`, `referralAddress`

---

## 🧪 Testing the Autonomous Agent

Run the bundled example agent script:

```bash
npm run start
# or
npx ts-node example-agent.ts
```

Output:
```text
🤖 Santa Rosa Autonomous Position Guardian (Coinbase AgentKit)
   Network: Base Mainnet (ChainId: 8453)
   Router:  0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57

[Phase 1] Scanning active lending positions...
[Phase 2] Simulating Pre-Flight Debt Rescue...
   ❌ MEV Liquidator Penalty (5%):    $5,000 USD
   ✅ Santa Rosa Flat Fee (0.25%):    $250 USD
   💰 Net User Savings:               $4,750 USD (20.0x cheaper)
   💸 Builder Revenue Share (0.05%):  $50 USDC [Instant on-chain]
[Phase 3] Generating Execution Calldata for Base Mainnet Router...
🎉 Position Guard Cycle Complete. Gas on Base L2: < $0.05 USD
```

---

## 🔗 Official Protocol References
* **Base Router Contract**: [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
* **MCP Public Gateway**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
* **GitHub Repository**: [lucascordone-spec/santa-rosa](https://github.com/lucascordone-spec/santa-rosa)
