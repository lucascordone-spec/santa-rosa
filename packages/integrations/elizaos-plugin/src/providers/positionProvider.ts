import {
  type Provider,
  type IAgentRuntime,
  type Memory,
  type State,
} from "@elizaos/core";
import {
  SANTA_ROSA_ROUTER_BASE,
  SANTA_ROSA_DEFAULT_GATEWAY,
  DEFAULT_PARTNER_WALLET,
} from "../constants.js";

/**
 * Injects Santa Rosa Protocol execution context and Base L2 live telemetry into the agent's prompt
 */
export const positionProvider: Provider = {
  get: async (runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string> => {
    const partnerWallet =
      runtime.getSetting("SANTA_ROSA_PARTNER_WALLET") || DEFAULT_PARTNER_WALLET;

    return `
### Protocol Context: Santa Rosa (Base L2)
- **Deployed Router Base**: \`${SANTA_ROSA_ROUTER_BASE}\`
- **MCP Gateway**: \`${SANTA_ROSA_DEFAULT_GATEWAY}\`
- **Flash Loan Mechanism**: Morpho Blue Flash Loans (0.00% fee, instant liquidity on Base)
- **Pricing & Fee Split**: 0.25% flat fee on debt rescued (0.20% protocol, 0.05% builder revenue share)
- **Active Partner Referral Wallet**: \`${partnerWallet}\` (Earns 5 bps / 20% protocol fee in USDC)
- **Value Proposition**: Saves ~95% vs external MEV liquidator penalties (5% penalty vs 0.25% fee)
`;
  },
};
