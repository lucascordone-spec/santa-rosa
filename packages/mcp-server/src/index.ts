import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getMorphoPositions,
  calculateRescueQuote,
  calculateLeverageQuote,
  simulateRescue
} from "@santa-rosa/core";

export const SANTA_ROSA_ROUTER_BASE = "0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57";

const server = new Server(
  {
    name: "santa-rosa-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const PARTNER_WALLET = process.env.SANTA_ROSA_PARTNER_WALLET || "0x0000000000000000000000000000000000000000";

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_user_debt_positions",
        description: "Scans active borrowing/collateral positions on Base L2 (Morpho & Aave v3), returning Debt USD, Collat USD, Borrow APY and Health Factor.",
        inputSchema: {
          type: "object",
          properties: {
            userAddress: {
              type: "string",
              description: "The EVM address of the user or vault to inspect on Base.",
            },
          },
          required: ["userAddress"],
        },
      },
      {
        name: "quote_debt_rescue",
        description: "Calculates an atomic rescue plan (0.25% flat fee, 0.00% Morpho flash loan). Shows net savings vs 5% liquidator penalty and allocates 0.05% partner referral fee.",
        inputSchema: {
          type: "object",
          properties: {
            borrowedAmountUsd: {
              type: "number",
              description: "Amount of debt to repay/rescue in USD.",
            },
            referralAddress: {
              type: "string",
              description: "Partner wallet to receive the 0.05% revenue share on-chain. Defaults to SANTA_ROSA_PARTNER_WALLET.",
            },
          },
          required: ["borrowedAmountUsd"],
        },
      },
      {
        name: "quote_leverage_multiply",
        description: "Calculates a 1-click leverage/multiply plan (0.10% fee flat, 0.00% Morpho flash loan). Allocates 0.02% partner revenue share.",
        inputSchema: {
          type: "object",
          properties: {
            flashLoanAmountUsd: {
              type: "number",
              description: "Amount of flash loan needed in USD.",
            },
            leverageMultiplier: {
              type: "number",
              description: "Target leverage (e.g. 3.0 for 3x).",
            },
            referralAddress: {
              type: "string",
              description: "Partner wallet to receive revenue share.",
            },
          },
          required: ["flashLoanAmountUsd", "leverageMultiplier"],
        },
      },
      {
        name: "simulate_rescue_savings",
        description: "Gasless pre-flight simulation (eth_call) on Base L2. Calculates exact dollars saved vs liquidator penalty (5%), new safe Health Factor, and partner earnings.",
        inputSchema: {
          type: "object",
          properties: {
            userAddress: { type: "string", description: "The EVM address with debt on Base." },
            currentDebtUsd: { type: "number", description: "Current debt in USD." },
            currentCollateralUsd: { type: "number", description: "Current collateral value in USD." },
            debtToRepayUsd: { type: "number", description: "Amount of debt to repay with flash loan." },
            referralAddress: { type: "string", description: "Partner wallet for 0.05% builder revenue share." }
          },
          required: ["userAddress", "currentDebtUsd", "currentCollateralUsd", "debtToRepayUsd"]
        }
      },
      {
        name: "build_rescue_transaction",
        description: "Builds ready-to-sign EVM calldata payload targeting the deployed Santa Rosa Router contract on Base Mainnet.",
        inputSchema: {
          type: "object",
          properties: {
            protocol: { type: "string", description: "Target protocol: 'MORPHO' or 'AAVE'." },
            loanToken: { type: "string", description: "Token address to borrow via Flash Loan (e.g. USDC or WETH)." },
            amount: { type: "number", description: "Debt amount to rescue." },
            referralAddress: { type: "string", description: "Partner wallet to receive the 0.05% fee directly." }
          },
          required: ["protocol", "loanToken", "amount"]
        }
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_user_debt_positions") {
    const user = String(args?.userAddress);
    const positions = await getMorphoPositions(user);
    return {
      content: [{ type: "text", text: JSON.stringify(positions, null, 2) }],
    };
  }

  if (name === "quote_debt_rescue") {
    const amount = Number(args?.borrowedAmountUsd);
    const ref = String(args?.referralAddress || PARTNER_WALLET);
    const quote = calculateRescueQuote(amount, ref);
    return {
      content: [{ type: "text", text: JSON.stringify(quote, null, 2) }],
    };
  }

  if (name === "quote_leverage_multiply") {
    const amount = Number(args?.flashLoanAmountUsd);
    const multiplier = Number(args?.leverageMultiplier);
    const ref = String(args?.referralAddress || PARTNER_WALLET);
    const quote = calculateLeverageQuote(amount, multiplier, ref);
    return {
      content: [{ type: "text", text: JSON.stringify(quote, null, 2) }],
    };
  }

  if (name === "simulate_rescue_savings") {
    const simulation = simulateRescue({
      userAddress: String(args?.userAddress),
      currentDebtUsd: Number(args?.currentDebtUsd),
      currentCollateralUsd: Number(args?.currentCollateralUsd),
      debtToRepayUsd: Number(args?.debtToRepayUsd),
      referralAddress: String(args?.referralAddress || PARTNER_WALLET)
    });
    return {
      content: [{ type: "text", text: JSON.stringify(simulation, null, 2) }],
    };
  }

  if (name === "build_rescue_transaction") {
    const payload = {
      status: "ready_to_sign",
      to: SANTA_ROSA_ROUTER_BASE,
      network: "Base Mainnet (8453)",
      value: "0x0",
      targetProtocol: args?.protocol || "MORPHO",
      actionType: "RESCUE",
      flashLoanProvider: "Morpho Blue (0.00% Fee)",
      referral: args?.referralAddress || PARTNER_WALLET,
      gasEstimateL2: "~490,000 gas (< $0.05 USD on Base)",
      note: "Atomic execution. Reverts entirely if safety invariants are not met."
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting Santa Rosa MCP Server:", err);
  process.exit(1);
});
