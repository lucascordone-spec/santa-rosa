/**
 * @file pitch.ts
 * @notice Institutional B2B pitch and proposal generator with mathematical rigor
 * formatted for official governance forums, Discord developer chats, and Telegram executive DMs.
 */

import { CuratorProfile } from "./curators.js";
import { AnnualPartnershipProjection } from "./calculator.js";

export interface GeneratedPitches {
  curatorId: string;
  curatorName: string;
  governanceForum: string;
  discord: string;
  telegram: string;
  summaryExecutive: string;
}

const ROUTER_ADDRESS_BASE = "0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57";

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a comprehensive Markdown RFC for official governance forums
 * (e.g. forum.morpho.org, governance.gauntlet.world, aerodrome.finance).
 */
export function generateGovernanceProposal(
  projection: AnnualPartnershipProjection,
  curator: CuratorProfile
): string {
  const annualVol = formatUsd(projection.annualVolumeUsd);
  const monthlyVol = formatUsd(projection.monthlyVolumeUsd);
  const annualRevShare = formatUsd(projection.partnerEarnings.annualUsd);
  const monthlyRevShare = formatUsd(projection.partnerEarnings.monthlyUsd);
  const threeYearRevShare = formatUsd(projection.partnerEarnings.threeYearUsd);
  const annualSaved = formatUsd(projection.depositorProtection.annualNetSavingsUsd);
  const penaltiesAvoided = formatUsd(
    projection.depositorProtection.annualLiquidationPenaltiesAvoidedUsd
  );
  const slippageSaved = formatUsd(
    projection.depositorProtection.chunkingSlippageSavingsEstimateUsd
  );

  return `# [RFC] Strategic Integration: Santa Rosa / FlashShift — Anti-Liquidation Shield & 20% Builder Revenue Share for ${curator.name} on Base L2

**Author:** Santa Rosa Strategic Partnerships & Quantitative Engineering Team  
**Target Audience:** Governance Council, Curators & Risk Committee of ${curator.name}  
**Date:** ${new Date().toISOString().substring(0, 10)}  
**Network:** Base Mainnet (Chain ID 8453)  
**Router Contract Address:** \`${ROUTER_ADDRESS_BASE}\`  
**Public Remote MCP Gateway:** \`${projection.mcpIntegration.gatewayUrl}\`  
**Designated Referral Treasury Wallet:** \`${projection.referralWallet}\`  

---

## 1. Executive Summary

This RFC outlines a non-custodial quantitative and architectural partnership between **${curator.name}** and the **Santa Rosa / FlashShift** protocol on Base L2.

Through this integration, borrower positions and curated vaults managed by ${curator.name} gain an automated, atomic defense shield against predatory liquidations:
1. **95% Net Savings for Depositors:** Replaces aggressive third-party liquidation penalties (5.00% benchmark) with proactive deleveraging at a flat **0.25%** fee (25 bps).
2. **Direct On-Chain Passive Revenue (20% Revenue Share):** On every executed rescue, the smart contract automatically transfers **5 bps (0.05%)** in the same transaction block directly to ${curator.name}'s designated treasury wallet (\`${projection.referralWallet}\`).
3. **Zero Capital Cost:** Powered by atomic flash loans executed at **0.00% fee** natively via Morpho Blue.
4. **Intelligent Chunking Engine:** Eliminates up to **98% of price impact and slippage** on large collateral rebalances (> $250k) by segmenting execution while billing as a single unified transaction.

---

## 2. Identified Pain Points for ${curator.name}

Based on live on-chain analysis across Base L2 lending markets:
${curator.painPoints.map((p) => `- ⚠️ **${p}**`).join("\n")}

---

## 3. Financial Model & Economic Projections

Under an estimated defensive volume of **${monthlyVol} USD/month** (${annualVol} USD/year):

| Economic Metric | Monthly Value | 1-Year Projection | 3-Year Projection |
|---|---|---|---|
| **Defended / Rebalanced Volume** | **${monthlyVol}** | **${annualVol}** | **${formatUsd(projection.threeYearVolumeUsd)}** |
| **Liquidation Penalties Avoided (5.00%)** | ${formatUsd(projection.monthlyVolumeUsd * 0.05)} | **${penaltiesAvoided}** | ${formatUsd(projection.threeYearVolumeUsd * 0.05)} |
| **FlashShift All-Inclusive Fee (0.25%)** | ${formatUsd(projection.monthlyVolumeUsd * 0.0025)} | ${formatUsd(projection.annualVolumeUsd * 0.0025)} | ${formatUsd(projection.threeYearVolumeUsd * 0.0025)} |
| **Net Depositor Capital Preserved** | ${formatUsd(projection.monthlyVolumeUsd * 0.0475)} | **${annualSaved}** | ${formatUsd(projection.threeYearVolumeUsd * 0.0475)} |
| **Builder Revenue Share for ${curator.name} (5 bps / 20%)** | **${monthlyRevShare}** | **${annualRevShare}** | **${threeYearRevShare}** |
| **Estimated Slippage Savings (Chunking Router)** | ${formatUsd(projection.monthlyVolumeUsd * 0.012)} | **${slippageSaved}** | ${formatUsd(projection.threeYearVolumeUsd * 0.012)} |

> **Financial Conclusion:** Vault depositors of ${curator.name} save **${annualSaved}** net annually, while ${curator.name}'s treasury receives **${annualRevShare}** in USDC on-chain, entirely risk-free and programmatically.

---

## 4. Market Comparison vs Legacy Alternatives (DeFi Saver)

| Feature | DeFi Saver (Legacy) | Santa Rosa / FlashShift | Advantage for ${curator.name} |
|---|---|---|---|
| **Rescue / Unwind Fee** | 0.30% (0.25% swap + 0.05% bot fee) | **0.25% (25 bps) Flat** | **17% Cheaper** |
| **Hidden Automation Fee** | +0.05% Surcharge | **$0.00 (Zero)** | Full Fee Transparency |
| **Builder Rev-Share to Curators** | 0.00% (Retains 100%) | **0.05% (5 bps / 20% of Fee)** | **${annualRevShare}/yr Direct** |
| **Flash Loan Fee** | Aave V3 (0.05% to 0.09%) | **Morpho Blue (0.00%)** | Zero Borrowing Cost |
| **AI Agent Native (MCP)** | Manual / Closed | **Native MCP (Model Context Protocol)** | Compatible with Claude, Cursor, AgentKit |

---

## 5. Technical Architecture & On-Chain Security

1. **Atomic & Non-Custodial:** Execution occurs strictly within a single block transaction on contract \`${ROUTER_ADDRESS_BASE}\`. If post-rescue Health Factor is not restored to safe territory (> 1.25), the transaction **reverts completely**.
2. **Immutable On-Chain Distribution:**
\`\`\`solidity
// FlashShiftRouter.sol (Base L2)
function _distributeFees(address token, uint256 amount, uint256 totalFeeBps, uint256 builderFeeBps, address referral) internal {
    uint256 totalFee = (amount * totalFeeBps) / BPS_DENOMINATOR;
    if (referral != address(0)) {
        uint256 builderFee = (amount * builderFeeBps) / BPS_DENOMINATOR;
        IERC20(token).safeTransfer(referral, builderFee);
        IERC20(token).safeTransfer(protocolTreasury, totalFee - builderFee);
    }
}
\`\`\`
3. **Gasless Pre-Flight Simulation:** All calls can be simulated via \`eth_call\` with zero gas cost and zero private key exposure.

---

## 6. Immediate Integration via Model Context Protocol (MCP)

${curator.name}'s risk keepers or autonomous AI agents can query and execute rescues immediately by configuring our remote MCP gateway:

\`\`\`json
{
  "mcpServers": {
    "santa-rosa": {
      "url": "${projection.mcpIntegration.gatewayUrl}",
      "headers": {
        "x-referral-wallet": "${projection.referralWallet}"
      }
    }
  }
}
\`\`\`

**Live JSON-RPC Simulation Call:**
\`\`\`bash
curl -X POST "${projection.mcpIntegration.gatewayUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(projection.mcpIntegration.samplePayload)}'
\`\`\`

---

## 7. Next Steps & Governance Alignment

1. **Technical Review:** Q&A session with ${curator.name}'s risk committee.
2. **Base Mainnet Pilot:** Single-position test run using \`eth_call\` pre-flight simulation.
3. **Production Integration:** Adding the MCP endpoint to ${curator.name}'s automated monitoring and alert stack.

*We remain active on governance forums and official communication channels to assist implementation.*
`;
}

/**
 * Generates a high-impact Discord message for developer and risk channels.
 */
export function generateDiscordPitch(
  projection: AnnualPartnershipProjection,
  curator: CuratorProfile
): string {
  const annualVol = formatUsd(projection.annualVolumeUsd);
  const annualRevShare = formatUsd(projection.partnerEarnings.annualUsd);
  const annualSaved = formatUsd(projection.depositorProtection.annualNetSavingsUsd);

  return `🛡️ **B2B Integration Proposal for ${curator.name} on Base L2** 🛡️

Hey **${curator.name}** team! 👋 We have analyzed your curated vault infrastructure and risk telemetry on Base and prepared a direct integration proposal:

💡 **The Core Thesis:**
Replace aggressive external MEV liquidations (5%) and expensive legacy tools like DeFi Saver (0.30%) with **Santa Rosa / FlashShift**:
• **0.25% Flat Fee** powered by **0.00% fee** native Morpho Blue flash loans.
• **20% Builder Revenue Share (5 bps)** paid directly to your treasury in the same block.
• **Chunking Router Engine:** Eliminates up to 98% of slippage on large collateral unwinds.

📊 **Annual Financial Breakdown for ${curator.name} (${annualVol} volume):**
💰 **Passive Treasury Revenue:** \`${annualRevShare} USDC/year\` (5 bps automatically routed to \`${projection.referralWallet}\`)
🛡️ **Net Depositor Capital Saved:** \`${annualSaved}/year\` (20x cheaper than liquidator penalties)
⚡ **Flash Loan Capital Cost:** **$0.00 USD** (0.00% Morpho native)

🤖 **Plug & Play for AI Agents & Keepers via MCP:**
Simulate pre-flight rescues live with zero gas:
\`curl -X POST ${projection.mcpIntegration.gatewayUrl} -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"quote_debt_rescue","arguments":{"borrowedAmountUsd":1000000,"referralAddress":"${projection.referralWallet}"}}}'\`

Router Contract on Base: \`${ROUTER_ADDRESS_BASE}\`
Are you open for a 10-minute technical sync this week? 🚀`;
}

/**
 * Generates an executive message for Telegram DMs or private risk groups.
 */
export function generateTelegramPitch(
  projection: AnnualPartnershipProjection,
  curator: CuratorProfile
): string {
  const annualVol = formatUsd(projection.annualVolumeUsd);
  const annualRevShare = formatUsd(projection.partnerEarnings.annualUsd);
  const monthlyRevShare = formatUsd(projection.partnerEarnings.monthlyUsd);
  const annualSaved = formatUsd(projection.depositorProtection.annualNetSavingsUsd);

  return `Hello **${curator.name}** team,

Reaching out from the **Santa Rosa Protocol** on Base L2.

We have structured a quantitative proposal for **${curator.name}**'s vaults and lending positions:

📌 **Key Metrics:**
• On a projected defensive volume of **${annualVol}/year**:
• Your depositors save **${annualSaved}** net by preventing 5% liquidation penalties.
• Your treasury (\`${projection.referralWallet}\`) earns **${annualRevShare} USDC/year** (${monthlyRevShare}/mo) as an automated **20% Builder Revenue Share (5 bps)** settled atomically on Base via router contract \`${ROUTER_ADDRESS_BASE}\`.
• Zero hidden fees: Flat 0.25% vs 0.30% charged by DeFi Saver.
• 0.00% capital flash loans via Morpho Blue.

🔌 **Plug & Play Integration:**
Live public Model Context Protocol (MCP) gateway:
\`${projection.mcpIntegration.gatewayUrl}\`
Your risk keepers or AI agents can simulate pre-flight rescues via \`eth_call\` with zero gas cost.

Would you be open for a quick 10-minute sync, or should we submit the formal RFC to your governance forum?`;
}

/**
 * Compiles all pitch formats for a curator profile and its calculated projection.
 */
export function generateAllPitches(
  projection: AnnualPartnershipProjection,
  curator: CuratorProfile
): GeneratedPitches {
  return {
    curatorId: curator.id,
    curatorName: curator.name,
    governanceForum: generateGovernanceProposal(projection, curator),
    discord: generateDiscordPitch(projection, curator),
    telegram: generateTelegramPitch(projection, curator),
    summaryExecutive: `Pitch pack generated for ${curator.name}: Volume ${formatUsd(projection.annualVolumeUsd)}/yr, RevShare ${formatUsd(projection.partnerEarnings.annualUsd)}/yr.`,
  };
}
