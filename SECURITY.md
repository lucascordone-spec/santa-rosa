# Security Policy — Santa Rosa Protocol

The Santa Rosa Protocol team takes the security of our smart contracts, API gateway, and MCP infrastructure with the highest level of institutional rigor. We are committed to protecting user funds and maintaining reliable machine-to-machine infrastructure on **Base L2**.

This document outlines our security model, threat prevention practices, responsible vulnerability disclosure process, and bug bounty guidelines.

---

## 🛡️ Security Architecture & Invariants

Santa Rosa operates as a **non-custodial, headless DeFi router** and Model Context Protocol execution gateway:

1. **Non-Custodial Design**:
   - The contract (`FlashShiftRouter.sol`) **never retains user collateral or borrow tokens** across blocks.
   - All operations (debt repayment, collateral release, swap, flash loan repayment) execute **atomically within a single EVM transaction**.

2. **Strict Callback Authorization**:
   - The Morpho Blue flash loan callback (`onMorphoFlashLoan`) enforces strict caller validation:
     ```solidity
     if (msg.sender != address(morpho)) revert UnauthorizedCallback();
     ```
   - Arbitrary or spoofed external calls to the callback revert immediately.

3. **Deterministic Revenue Share Splitting**:
   - The rescue fee (0.25% flat) and leverage fee (0.10% flat) are hardcoded constants in the router.
   - The builder revenue share (20% of fee = 0.05% of volume for rescues) is transferred directly to the designated builder address in the exact same transaction block using OpenZeppelin's `SafeERC20`.

4. **Whitelisted Aggregator Execution**:
   - Swaps are routed only through verified aggregators and private market makers (PMMs) registered via `isApprovedAggregator`.

---

## 🎯 In-Scope Components

| Component | Target Address / Identifier | Network |
| :--- | :--- | :--- |
| **FlashShiftRouter** | [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57) | Base Mainnet (ChainId: 8453) |
| **Contracts Source** | `contracts/src/FlashShiftRouter.sol` | Solidity 0.8.20 |
| **MCP Remote Gateway** | `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp` | Remote JSON-RPC 2.0 |
| **Public REST API** | `https://sunset-determining-budget-deluxe.trycloudflare.com/health` | HTTP REST |
| **Core Math Engine** | `packages/core/src/` | TypeScript / Viem |

### Out of Scope:
- Underlying third-party protocol contracts (Morpho Blue, Aave v3, KyberSwap, Aerodrome).
- Cloudflare edge network infrastructure and DDoS on public tunnels.
- Front-end / UI visual rendering bugs without financial impact.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or exploit vector, **DO NOT** create a public issue, pull request, or discussion thread.

Please submit your report through one of the following secure channels:

1. **GitHub Private Vulnerability Reporting**:
   - Navigate to the [Security Advisories tab](https://github.com/lucascordone-spec/santa-rosa/security/advisories) on GitHub.
   - Click **"Report a vulnerability"** to open an encrypted advisory draft.

2. **Direct Security Email**:
   - Send full technical details, proof-of-concept (PoC), and affected contract/commit to:
     `security@santarosaprotocol.xyz` (or `lucas@santarosa.fi`)
   - Please include:
     - Clear description of the vulnerability.
     - Step-by-step reproduction instructions or a Foundry test case (`.t.sol`).
     - Assessment of potential financial impact (funds at risk, fee drain, denial of service).
     - Your wallet address for bounty attribution.

---

## ⏱️ Response SLA (Service Level Agreement)

| Phase | Target Timeline | Action |
| :--- | :--- | :--- |
| **Initial Acknowledgment** | `< 24 hours` | A human security engineer confirms receipt of the report. |
| **Severity Triage** | `< 72 hours` | Reproduction in local Foundry fork simulation and impact scoring. |
| **Remediation & Patch** | `< 7 days` | On-chain mitigation or contract upgrade deployment. |
| **Public Disclosure** | Coordinated | Full technical post-mortem published once fix is live and verified. |

---

## 💰 Bug Bounty Guidelines

Santa Rosa recognizes and rewards security researchers who ethically discover and report vulnerabilities. Rewards are determined based on the **CVSS v3** (Common Vulnerability Scoring System) framework:

| Severity | Impact Description | Reward Range |
| :--- | :--- | :--- |
| **Critical** | Direct theft of user collateral, unauthorized contract drainage, or unconstrained flash loan insolvency. | **Up to $25,000 USD** (paid in USDC or ETH) |
| **High** | Temporary freeze of protocol funds, bypass of builder revenue share, or unauthorized slippage manipulation. | **Up to $10,000 USD** |
| **Medium** | State desynchronization between Core simulation and on-chain router execution, or keeper bot manipulation. | **Up to $2,500 USD** |
| **Low** | Minor mathematical rounding issues (< 1 bps) or non-exploitable edge cases. | **Up to $500 USD** |

---

## 🤝 Safe Harbor

Santa Rosa Protocol commits to not pursue legal action against security researchers who:
- Act in good faith to avoid privacy violations, data destruction, and interruption of protocol services.
- Give us reasonable time to remedy the vulnerability before disclosing any information publicly.
- Do not exploit the vulnerability beyond what is strictly necessary to demonstrate proof-of-concept.
- Interact only with test accounts or accounts under their direct control during on-chain verification.

Thank you for helping keep Santa Rosa Protocol safe for all users, agents, and liquidity providers!
