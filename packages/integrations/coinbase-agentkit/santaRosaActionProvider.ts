import { z } from "zod";

export const SANTA_ROSA_DEFAULT_GATEWAY = "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp";
export const SANTA_ROSA_ROUTER_BASE = "0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57";
export const DEFAULT_PARTNER_WALLET = "0x8f7670EA615910D0A86320e84A611577F68E3908";

/**
 * Compatible AgentKit Interfaces & Base Classes
 * Fully interoperable with @coinbase/agentkit standard runtime
 */
export interface Network {
  protocolFamily: string;
  networkId?: string;
  chainId?: string;
}

export interface WalletProvider {
  getAddress(): Promise<string>;
  getNetwork(): Promise<Network>;
}

export abstract class ActionProvider<T = WalletProvider> {
  name: string;
  actionList: any[];
  constructor(name: string, actionList: any[] = []) {
    this.name = name;
    this.actionList = actionList;
  }
  abstract supportsNetwork(network: Network): boolean;
}

export function CreateAction(options: { name: string; description: string; schema: any }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.__actions) {
      target.__actions = [];
    }
    target.__actions.push({ ...options, method: propertyKey });
    return descriptor;
  };
}

/**
 * Zod Schemas for Santa Rosa Action Provider
 */
export const GetUserDebtPositionsSchema = z.object({
  userAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address")
    .describe("The EVM wallet or vault address to inspect for active debt/collateral on Base L2."),
});

export const SimulateRescueSavingsSchema = z.object({
  userAddress: z
    .string()
    .describe("The borrower address on Base whose debt is at risk of liquidation."),
  currentDebtUsd: z
    .number()
    .positive()
    .describe("Total current debt amount in USD."),
  currentCollateralUsd: z
    .number()
    .positive()
    .describe("Current market value of the collateral in USD."),
  debtToRepayUsd: z
    .number()
    .positive()
    .describe("Amount of debt to repay using Morpho Blue 0.00% fee flash loans."),
  referralAddress: z
    .string()
    .optional()
    .describe("Developer/Partner EVM address to receive 0.05% builder revenue share in USDC on-chain."),
});

export const QuoteDebtRescueSchema = z.object({
  borrowedAmountUsd: z
    .number()
    .positive()
    .describe("Total debt amount in USD to rescue and deleverage."),
  referralAddress: z
    .string()
    .optional()
    .describe("Partner wallet to receive 0.05% builder fee (20% of protocol fee) in USDC."),
});

export const QuoteLeverageMultiplySchema = z.object({
  flashLoanAmountUsd: z
    .number()
    .positive()
    .describe("Flash loan capital amount in USD needed to multiply exposure."),
  leverageMultiplier: z
    .number()
    .min(1.1)
    .max(10.0)
    .describe("Target leverage multiplier (e.g. 2.5 for 2.5x)."),
  referralAddress: z
    .string()
    .optional()
    .describe("Partner wallet to receive 0.02% revenue share on flash leverage volume."),
});

export const BuildRescueTransactionSchema = z.object({
  protocol: z
    .enum(["MORPHO", "AAVE"])
    .default("MORPHO")
    .describe("Target protocol to execute rescue on: 'MORPHO' or 'AAVE'."),
  loanToken: z
    .string()
    .describe("Contract address or symbol of loan token to borrow via flash loan (e.g. USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)."),
  amount: z
    .number()
    .positive()
    .describe("Amount of debt to repay in token units."),
  referralAddress: z
    .string()
    .optional()
    .describe("Partner wallet to receive instant 0.05% builder revenue share in the same block."),
});

export interface SantaRosaActionProviderConfig {
  gatewayUrl?: string;
  partnerWallet?: string;
}

/**
 * Santa Rosa Action Provider for Coinbase AgentKit
 * Enables autonomous AI agents to inspect DeFi debt positions, execute zero-penalty debt rescues,
 * leverage positions via 0% fee Morpho flash loans, and collect instant 0.05% builder revenue share.
 */
export class SantaRosaActionProvider extends ActionProvider<WalletProvider> {
  private gatewayUrl: string;
  private partnerWallet: string;

  constructor(config?: SantaRosaActionProviderConfig) {
    super("santa-rosa", []);
    this.gatewayUrl = config?.gatewayUrl || (typeof process !== "undefined" ? process.env?.SANTA_ROSA_GATEWAY_URL : undefined) || SANTA_ROSA_DEFAULT_GATEWAY;
    this.partnerWallet = config?.partnerWallet || (typeof process !== "undefined" ? process.env?.SANTA_ROSA_PARTNER_WALLET : undefined) || DEFAULT_PARTNER_WALLET;
  }

  /**
   * Helper to query Santa Rosa Gateway JSON-RPC 2.0 endpoint
   */
  private async callMcpGateway(toolName: string, args: Record<string, unknown>): Promise<any> {
    const response = await fetch(this.gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-id": "coinbase-agentkit-native",
        "x-framework": "Coinbase AgentKit",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Santa Rosa Gateway error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    if (data.error) {
      throw new Error(`MCP Tool Error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const textContent = data.result?.content?.[0]?.text;
    try {
      return JSON.parse(textContent);
    } catch {
      return textContent;
    }
  }

  /**
   * Scans active debt and collateral positions on Base L2 (Morpho Blue & Aave v3)
   */
  @CreateAction({
    name: "get_user_debt_positions",
    description: "Scan active debt positions on Base L2 (Morpho Blue & Aave v3), returning debt USD, collateral USD, borrow APY, and Health Factor.",
    schema: GetUserDebtPositionsSchema,
  })
  async getUserDebtPositions(
    _walletProvider: WalletProvider,
    args: z.infer<typeof GetUserDebtPositionsSchema>
  ): Promise<string> {
    try {
      const positions = await this.callMcpGateway("get_user_debt_positions", {
        userAddress: args.userAddress,
      });
      return JSON.stringify({
        status: "success",
        user: args.userAddress,
        network: "Base L2 (8453)",
        positions,
      }, null, 2);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Failed to fetch debt positions: ${error.message}`,
      });
    }
  }

  /**
   * Simulates pre-flight debt rescue savings mathematically vs 5% MEV liquidator penalty
   */
  @CreateAction({
    name: "simulate_rescue_savings",
    description: "Simulate zero-penalty anti-liquidation rescue. Proves 20x savings vs MEV liquidation penalty and computes 0.05% builder revenue share.",
    schema: SimulateRescueSavingsSchema,
  })
  async simulateRescueSavings(
    _walletProvider: WalletProvider,
    args: z.infer<typeof SimulateRescueSavingsSchema>
  ): Promise<string> {
    try {
      const partner = args.referralAddress || this.partnerWallet;
      const simulation = await this.callMcpGateway("simulate_rescue_savings", {
        userAddress: args.userAddress,
        currentDebtUsd: args.currentDebtUsd,
        currentCollateralUsd: args.currentCollateralUsd,
        debtToRepayUsd: args.debtToRepayUsd,
        referralAddress: partner,
      });

      return JSON.stringify({
        status: "success",
        simulation,
        builderIncentive: {
          partnerWallet: partner,
          builderRevShareUsd: simulation.financialComparison?.builderFeeUsd,
          revenueShareRate: "0.05% (5 bps / 20% protocol fee share)",
          payoutMechanism: "Instant on-chain USDC transfer in same execution block",
        },
      }, null, 2);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Rescue simulation failed: ${error.message}`,
      });
    }
  }

  /**
   * Quotes anti-liquidation rescue fee breakdown
   */
  @CreateAction({
    name: "quote_debt_rescue",
    description: "Calculate fee breakdown for atomic debt rescue: 0.25% flat fee with 0.00% Morpho flash loan, saving 95% vs liquidation penalty.",
    schema: QuoteDebtRescueSchema,
  })
  async quoteDebtRescue(
    _walletProvider: WalletProvider,
    args: z.infer<typeof QuoteDebtRescueSchema>
  ): Promise<string> {
    try {
      const partner = args.referralAddress || this.partnerWallet;
      const quote = await this.callMcpGateway("quote_debt_rescue", {
        borrowedAmountUsd: args.borrowedAmountUsd,
        referralAddress: partner,
      });
      return JSON.stringify({
        status: "success",
        quote,
      }, null, 2);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Quote rescue failed: ${error.message}`,
      });
    }
  }

  /**
   * Quotes 1-click leverage multiply plan
   */
  @CreateAction({
    name: "quote_leverage_multiply",
    description: "Quote 1-click leverage multiply using Morpho Blue 0.00% fee flash loan at 0.10% flat fee (0.08% protocol / 0.02% partner).",
    schema: QuoteLeverageMultiplySchema,
  })
  async quoteLeverageMultiply(
    _walletProvider: WalletProvider,
    args: z.infer<typeof QuoteLeverageMultiplySchema>
  ): Promise<string> {
    try {
      const partner = args.referralAddress || this.partnerWallet;
      const quote = await this.callMcpGateway("quote_leverage_multiply", {
        flashLoanAmountUsd: args.flashLoanAmountUsd,
        leverageMultiplier: args.leverageMultiplier,
        referralAddress: partner,
      });
      return JSON.stringify({
        status: "success",
        quote,
      }, null, 2);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Leverage quote failed: ${error.message}`,
      });
    }
  }

  /**
   * Builds ready-to-sign transaction payload targeting Santa Rosa Router on Base Mainnet
   */
  @CreateAction({
    name: "build_rescue_transaction",
    description: "Build ready-to-sign EVM calldata targeting Santa Rosa Router (0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57) on Base Mainnet.",
    schema: BuildRescueTransactionSchema,
  })
  async buildRescueTransaction(
    _walletProvider: WalletProvider,
    args: z.infer<typeof BuildRescueTransactionSchema>
  ): Promise<string> {
    try {
      const partner = args.referralAddress || this.partnerWallet;
      const txPayload = await this.callMcpGateway("build_rescue_transaction", {
        protocol: args.protocol,
        loanToken: args.loanToken,
        amount: args.amount,
        referralAddress: partner,
      });
      return JSON.stringify({
        status: "success",
        routerContract: SANTA_ROSA_ROUTER_BASE,
        network: "Base Mainnet (8453)",
        txPayload,
      }, null, 2);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: `Build transaction failed: ${error.message}`,
      });
    }
  }

  /**
   * Defines network compatibility: Base Mainnet (ChainId 8453)
   */
  supportsNetwork = (network: Network): boolean => {
    return (
      network.protocolFamily === "evm" &&
      (network.networkId === "base-mainnet" || network.chainId === "8453" || !network.networkId)
    );
  };
}

/**
 * Factory helper function to instantiate SantaRosaActionProvider
 */
export const santaRosaActionProvider = (config?: SantaRosaActionProviderConfig) =>
  new SantaRosaActionProvider(config);
