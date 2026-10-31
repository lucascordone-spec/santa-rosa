import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type ActionExample,
} from "@elizaos/core";
import { SANTA_ROSA_DEFAULT_GATEWAY, DEFAULT_PARTNER_WALLET } from "../constants.js";
import { type RescueSimulationResult } from "../types.js";

export const simulateRescueAction: Action = {
  name: "SIMULATE_RESCUE_SAVINGS",
  similes: [
    "CALCULATE_DELEVERAGE_SAVINGS",
    "ESTIMATE_RESCUE_PROFIT",
    "SIMULATE_FLASH_LOAN_RESCUE",
    "COMPARE_LIQUIDATION_COST",
  ],
  description:
    "Simulates zero-penalty anti-liquidation rescue via Morpho flash loan. Proves mathematically that the user saves ~95% vs a 5% liquidator penalty and credits 0.05% to the builder wallet.",

  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || "";
    return (
      text.includes("simulate") ||
      text.includes("rescue") ||
      text.includes("savings") ||
      text.includes("ahorro") ||
      text.includes("rescatar") ||
      (text.includes("simul") && text.includes("deuda"))
    );
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: Record<string, unknown>,
    callback?: HandlerCallback
  ): Promise<boolean> => {
    try {
      const text = message.content.text || "";
      const addressMatch = text.match(/0x[a-fA-F0-9]{40}/);
      const userAddress =
        addressMatch?.[0] ||
        runtime.getSetting("WALLET_ADDRESS") ||
        "0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c";

      // Extraer números si el usuario especificó montos, sino usar defaults representativos
      const amounts = text.match(/\$?[0-9]+([,.][0-9]+)?/g)?.map((s: string) => Number(s.replace(/[\$,]/g, ""))) || [];
      const currentDebt = amounts[0] || 100000;
      const currentCollateral = amounts[1] || currentDebt * 1.05;
      const debtToRepay = amounts[2] || currentDebt * 0.5;

      const partnerWallet =
        runtime.getSetting("SANTA_ROSA_PARTNER_WALLET") || DEFAULT_PARTNER_WALLET;
      const gatewayUrl =
        runtime.getSetting("SANTA_ROSA_GATEWAY_URL") || SANTA_ROSA_DEFAULT_GATEWAY;

      const res = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-id": runtime.agentId || "eliza-agent",
          "x-framework": "ElizaOS",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "simulate_rescue_savings",
            arguments: {
              userAddress,
              currentDebtUsd: currentDebt,
              currentCollateralUsd: currentCollateral,
              debtToRepayUsd: debtToRepay,
              referralAddress: partnerWallet,
            },
          },
        }),
      });

      const json = (await res.json()) as any;
      const textResult = json.result?.content?.[0]?.text;
      const sim: RescueSimulationResult = textResult ? JSON.parse(textResult) : null;

      if (!sim) {
        throw new Error("No se pudo obtener la simulación del gateway.");
      }

      const comp = sim.financialComparison;
      let reply = `⚡ **[Simulación Matemática de Rescate Santa Rosa]**\n\n`;
      reply += `👤 **Usuario**: \`${userAddress}\`\n`;
      reply += `📉 **Health Factor Previo**: ${sim.statusBefore.healthFactor} (${sim.statusBefore.riskLevel})\n`;
      reply += `📈 **Health Factor Proyectado**: **${sim.statusAfter.projectedHealthFactor}** (ZONA SEGURA)\n\n`;
      reply += `📊 **Comparativa Financiera vs Liquidación MEV:**\n`;
      reply += `❌ **Penalización Liquidación (5%)**: -$${comp.liquidationPenaltyIfLiquidatedUsd.toLocaleString()} USD\n`;
      reply += `✅ **Tarifa Plana Santa Rosa (0.25%)**: -$${comp.flashShiftFeeUsd.toLocaleString()} USD\n`;
      reply += `💰 **Ahorro Neto en el Bolsillo**: **+$${comp.netMoneySavedUsd.toLocaleString()} USD** (${comp.savingsMultiplier})\n\n`;
      reply += `🤝 **Incentivo Builder Rev-Share (0.05%)**: **+$${comp.builderFeeUsd.toLocaleString()} USDC** transferidos en el mismo bloque a \`${partnerWallet}\`.\n`;
      reply += `⛽ **Costo de Gas en Base L2**: < $0.05 USD.`;

      if (callback) {
        callback({
          text: reply,
          content: { simulation: sim, partnerWallet },
        });
      }

      return true;
    } catch (err: any) {
      console.error("[SIMULATE_RESCUE_SAVINGS] Error:", err);
      if (callback) {
        callback({
          text: `❌ Error en la simulación de rescate: ${err.message}`,
        });
      }
      return false;
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Simula el rescate de mi deuda de $100,000 en Base" },
      },
      {
        user: "{{agent}}",
        content: {
          text: "Ejecutando simulación de rescate gasless para calcular tu ahorro neto frente al liquidador...",
          action: "SIMULATE_RESCUE_SAVINGS",
        },
      },
    ],
  ] as ActionExample[][],
};
