/**
 * @file calculator.ts
 * @notice Módulo de cálculo matemático, proyecciones económicas y conexión con el
 * Gateway MCP público (https://sunset-determining-budget-deluxe.trycloudflare.com/mcp).
 * Calcula en tiempo real cotizaciones oficiales, reparto de Builder Revenue Share (80/20),
 * y ahorro neto anual frente a penalizaciones por liquidación en Base L2.
 */

export const DEFAULT_MCP_GATEWAY_URL =
  process.env.SANTA_ROSA_MCP_GATEWAY ||
  "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp";

export interface RescueQuoteResult {
  action: "RESCUE";
  borrowedAmountUsd: number;
  totalFeeUsd: number;       // 0.25% (25 bps)
  protocolFeeUsd: number;    // 0.20% (20 bps, 80% del fee)
  builderFeeUsd: number;     // 0.05% (5 bps, 20% del fee)
  penaltySavedUsd: number;   // 5.00% penalización evitada
  netSavingsUsd: number;     // Ahorro neto en el bolsillo de depositantes
  referral: string | null;
  source: "LIVE_MCP_GATEWAY" | "LOCAL_DETERMINISTIC";
}

export interface LeverageQuoteResult {
  action: "LEVERAGE";
  flashLoanAmountUsd: number;
  leverageMultiplier: number;
  totalFeeUsd: number;       // 0.10% (10 bps)
  protocolFeeUsd: number;    // 0.08% (80%)
  builderFeeUsd: number;     // 0.02% (20%)
  referral: string | null;
  source: "LIVE_MCP_GATEWAY" | "LOCAL_DETERMINISTIC";
}

export interface AnnualPartnershipProjection {
  curatorName: string;
  referralWallet: string;
  monthlyVolumeUsd: number;
  annualVolumeUsd: number;
  threeYearVolumeUsd: number;

  fees: {
    totalFeeBps: number;              // 25 bps (0.25%)
    protocolFeeBps: number;           // 20 bps (0.20%)
    builderRevenueShareBps: number;   // 5 bps (0.05% - 20% del total)
    revenueShareSplitPercent: string; // "80% Protocolo / 20% Partner"
  };

  partnerEarnings: {
    monthlyUsd: number;
    annualUsd: number;
    threeYearUsd: number;
  };

  protocolEarnings: {
    monthlyUsd: number;
    annualUsd: number;
  };

  depositorProtection: {
    benchmarkLiquidationPenaltyBps: number; // 500 bps (5.00%)
    annualLiquidationPenaltiesAvoidedUsd: number;
    annualNetSavingsUsd: number;
    savingsMultiplier: string; // "20.0x más económico que liquidación"
    chunkingSlippageSavingsEstimateUsd: number; // Ahorro adicional por evitar swaps sin chunking
  };

  mcpIntegration: {
    gatewayUrl: string;
    samplePayload: {
      jsonrpc: string;
      id: number;
      method: string;
      params: {
        name: string;
        arguments: {
          borrowedAmountUsd: number;
          referralAddress: string;
        };
      };
    };
  };
}

/**
 * Invoca de manera segura una herramienta en el Gateway MCP público vía JSON-RPC 2.0.
 */
export async function callMcpTool<T = any>(
  toolName: string,
  toolArgs: Record<string, any>,
  gatewayUrl: string = DEFAULT_MCP_GATEWAY_URL,
  timeoutMs: number = 8000
): Promise<{ success: boolean; data: T | null; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Agent-Id": "santa-rosa-b2b-partner-agent",
        "X-Framework": "Santa-Rosa-Acquisition-SDK",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: toolArgs,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return { success: false, data: null, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const json = (await res.json()) as any;
    if (json.error) {
      return { success: false, data: null, error: json.error.message || "MCP RPC Error" };
    }

    const textContent = json.result?.content?.[0]?.text;
    if (!textContent) {
      return { success: false, data: null, error: "Empty content from MCP tool" };
    }

    const parsedData = JSON.parse(textContent) as T;
    return { success: true, data: parsedData };
  } catch (err: any) {
    clearTimeout(timer);
    return { success: false, data: null, error: err?.message || String(err) };
  }
}

/**
 * Cotiza un rescate preventivo de deuda llamando en vivo al Gateway MCP público.
 * Con fallback matemático transparente en caso de interrupción temporal de red.
 */
export async function quoteRescueLive(
  borrowedAmountUsd: number,
  referralAddress?: string,
  gatewayUrl: string = DEFAULT_MCP_GATEWAY_URL
): Promise<RescueQuoteResult> {
  const ref = referralAddress || "0x0000000000000000000000000000000000000000";

  // Intento de llamada al gateway MCP público
  const mcpCall = await callMcpTool<any>(
    "quote_debt_rescue",
    { borrowedAmountUsd, referralAddress: ref },
    gatewayUrl
  );

  if (mcpCall.success && mcpCall.data) {
    return {
      action: "RESCUE",
      borrowedAmountUsd: Number(mcpCall.data.borrowedAmountUsd),
      totalFeeUsd: Number(mcpCall.data.totalFeeUsd),
      protocolFeeUsd: Number(mcpCall.data.protocolFeeUsd),
      builderFeeUsd: Number(mcpCall.data.builderFeeUsd),
      penaltySavedUsd: Number(mcpCall.data.penaltySavedUsd),
      netSavingsUsd: Number(mcpCall.data.netSavingsUsd),
      referral: mcpCall.data.referral,
      source: "LIVE_MCP_GATEWAY",
    };
  }

  // Fallback canónico verificable según la lógica matemática de FlashShift
  const TOTAL_FEE = 0.0025;      // 0.25%
  const PROTOCOL_SHARE = 0.0020; // 0.20% (80%)
  const BUILDER_SHARE = 0.0005;  // 0.05% (20%)

  const totalFeeUsd = borrowedAmountUsd * TOTAL_FEE;
  const isRefActive = ref && ref !== "0x0000000000000000000000000000000000000000";
  const builderFeeUsd = isRefActive ? borrowedAmountUsd * BUILDER_SHARE : 0;
  const protocolFeeUsd = totalFeeUsd - builderFeeUsd;
  const penaltySavedUsd = borrowedAmountUsd * 0.05;
  const netSavingsUsd = penaltySavedUsd - totalFeeUsd;

  return {
    action: "RESCUE",
    borrowedAmountUsd,
    totalFeeUsd,
    protocolFeeUsd,
    builderFeeUsd,
    penaltySavedUsd,
    netSavingsUsd,
    referral: isRefActive ? ref : null,
    source: "LOCAL_DETERMINISTIC",
  };
}

/**
 * Cotiza una operación de leverage/multiply vía Gateway MCP.
 */
export async function quoteLeverageLive(
  flashLoanAmountUsd: number,
  leverageMultiplier: number,
  referralAddress?: string,
  gatewayUrl: string = DEFAULT_MCP_GATEWAY_URL
): Promise<LeverageQuoteResult> {
  const ref = referralAddress || "0x0000000000000000000000000000000000000000";

  const mcpCall = await callMcpTool<any>(
    "quote_leverage_multiply",
    { flashLoanAmountUsd, leverageMultiplier, referralAddress: ref },
    gatewayUrl
  );

  if (mcpCall.success && mcpCall.data) {
    return {
      action: "LEVERAGE",
      flashLoanAmountUsd: Number(mcpCall.data.flashLoanAmountUsd),
      leverageMultiplier: Number(mcpCall.data.leverageMultiplier),
      totalFeeUsd: Number(mcpCall.data.totalFeeUsd),
      protocolFeeUsd: Number(mcpCall.data.protocolFeeUsd),
      builderFeeUsd: Number(mcpCall.data.builderFeeUsd),
      referral: mcpCall.data.referral,
      source: "LIVE_MCP_GATEWAY",
    };
  }

  // Fallback canónico
  const TOTAL_FEE = 0.0010;      // 0.10%
  const BUILDER_SHARE = 0.0002;  // 0.02% (20%)
  const totalFeeUsd = flashLoanAmountUsd * TOTAL_FEE;
  const isRefActive = ref && ref !== "0x0000000000000000000000000000000000000000";
  const builderFeeUsd = isRefActive ? flashLoanAmountUsd * BUILDER_SHARE : 0;
  const protocolFeeUsd = totalFeeUsd - builderFeeUsd;

  return {
    action: "LEVERAGE",
    flashLoanAmountUsd,
    leverageMultiplier,
    totalFeeUsd,
    protocolFeeUsd,
    builderFeeUsd,
    referral: isRefActive ? ref : null,
    source: "LOCAL_DETERMINISTIC",
  };
}

/**
 * Simula el rescate de una posición específica con llamada gasless al MCP.
 */
export async function simulateRescueLive(
  params: {
    userAddress: string;
    currentDebtUsd: number;
    currentCollateralUsd: number;
    debtToRepayUsd: number;
    referralAddress?: string;
  },
  gatewayUrl: string = DEFAULT_MCP_GATEWAY_URL
): Promise<any> {
  const mcpCall = await callMcpTool<any>("simulate_rescue_savings", params, gatewayUrl);
  return mcpCall.data;
}

/**
 * Calcula la proyección económica completa y personalizada a 1 y 3 años
 * para un socio institucional con base en su volumen objetivo mensual.
 */
export async function calculatePartnershipProjection(
  params: {
    curatorName: string;
    referralWallet: string;
    monthlyVolumeUsd: number;
  },
  gatewayUrl: string = DEFAULT_MCP_GATEWAY_URL
): Promise<AnnualPartnershipProjection> {
  const { curatorName, referralWallet, monthlyVolumeUsd } = params;

  // Realizamos una cotización real sobre el volumen mensual en el Gateway MCP
  const monthlyQuote = await quoteRescueLive(monthlyVolumeUsd, referralWallet, gatewayUrl);

  const annualVolumeUsd = monthlyVolumeUsd * 12;
  const threeYearVolumeUsd = annualVolumeUsd * 3;

  const monthlyPartnerEarnings = monthlyQuote.builderFeeUsd;
  const annualPartnerEarnings = monthlyPartnerEarnings * 12;
  const threeYearPartnerEarnings = annualPartnerEarnings * 3;

  const monthlyProtocolEarnings = monthlyQuote.protocolFeeUsd;
  const annualProtocolEarnings = monthlyProtocolEarnings * 12;

  const annualLiquidationPenaltiesAvoidedUsd = annualVolumeUsd * 0.05; // 5% penalización
  const annualTotalFeesUsd = monthlyQuote.totalFeeUsd * 12;
  const annualNetSavingsUsd = annualLiquidationPenaltiesAvoidedUsd - annualTotalFeesUsd;

  // Estimación conservadora de ahorro en slippage vía Router Chunking:
  // Para órdenes grandes, evita al menos un 1.2% de deslizamiento de swap medio
  const chunkingSlippageSavingsEstimateUsd = annualVolumeUsd * 0.012;

  return {
    curatorName,
    referralWallet,
    monthlyVolumeUsd,
    annualVolumeUsd,
    threeYearVolumeUsd,

    fees: {
      totalFeeBps: 25,
      protocolFeeBps: 20,
      builderRevenueShareBps: 5,
      revenueShareSplitPercent: "80% Protocolo / 20% Partner",
    },

    partnerEarnings: {
      monthlyUsd: monthlyPartnerEarnings,
      annualUsd: annualPartnerEarnings,
      threeYearUsd: threeYearPartnerEarnings,
    },

    protocolEarnings: {
      monthlyUsd: monthlyProtocolEarnings,
      annualUsd: annualProtocolEarnings,
    },

    depositorProtection: {
      benchmarkLiquidationPenaltyBps: 500,
      annualLiquidationPenaltiesAvoidedUsd,
      annualNetSavingsUsd,
      savingsMultiplier: "20.0x más económico que liquidación forzada (95% de descuento)",
      chunkingSlippageSavingsEstimateUsd,
    },

    mcpIntegration: {
      gatewayUrl,
      samplePayload: {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "quote_debt_rescue",
          arguments: {
            borrowedAmountUsd: monthlyVolumeUsd,
            referralAddress: referralWallet,
          },
        },
      },
    },
  };
}
