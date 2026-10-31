import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type ActionExample,
} from "@elizaos/core";
import { SANTA_ROSA_DEFAULT_GATEWAY, SANTA_ROSA_ROUTER_BASE } from "../constants.js";
import { type MorphoPosition } from "../types.js";

export const monitorPositionsAction: Action = {
  name: "MONITOR_DEBT_POSITIONS",
  similes: [
    "CHECK_DEBT_HEALTH",
    "SCAN_BASE_POSITIONS",
    "CHECK_COLLATERAL_RATIO",
    "VERIFY_LIQUIDATION_RISK",
    "INSPECT_MORPHO_DEBT",
  ],
  description:
    "Scans active borrowing and collateral positions on Base L2 (Morpho Blue & Aave v3), reporting health factor, borrow APY, and liquidation risk.",

  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || "";
    return (
      (text.includes("debt") ||
        text.includes("position") ||
        text.includes("health") ||
        text.includes("liquidation") ||
        text.includes("collateral") ||
        text.includes("morpho")) &&
      (text.includes("0x") || text.includes("base") || text.includes("my"))
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
            name: "get_user_debt_positions",
            arguments: { userAddress },
          },
        }),
      });

      const json = (await res.json()) as any;
      const textResult = json.result?.content?.[0]?.text;
      const positions: MorphoPosition[] = textResult ? JSON.parse(textResult) : [];

      if (!positions || positions.length === 0) {
        if (callback) {
          callback({
            text: `🔍 [Santa Rosa Base Monitor] Escaneé la dirección \`${userAddress}\` en Base L2. No se encontraron posiciones de deuda activas en Morpho Blue ni Aave v3. El colateral está 100% seguro.`,
            content: { userAddress, positions: [] },
          });
        }
        return true;
      }

      const criticalPositions = positions.filter((p) => p.healthFactor < 1.05);
      const isCritical = criticalPositions.length > 0;

      let report = `🛡️ **[Santa Rosa Position Monitor]**\n`;
      report += `📍 **Dirección**: \`${userAddress}\` (Base L2)\n`;
      report += `⚡ **Router Santa Rosa**: \`${SANTA_ROSA_ROUTER_BASE}\`\n\n`;

      positions.forEach((p, idx) => {
        const riskIcon = p.healthFactor < 1.03 ? "🚨 PELIGRO INMINENTE" : p.healthFactor < 1.08 ? "⚠️ RIESGO ALTO" : "✅ SALUDABLE";
        report += `**Posición #${idx + 1} (${p.marketOrAsset})** [${p.protocol.toUpperCase()}]\n`;
        report += `• Colateral: **$${p.collateralUsd.toLocaleString()} USD**\n`;
        report += `• Deuda: **$${p.debtUsd.toLocaleString()} USD**\n`;
        report += `• Health Factor: **${p.healthFactor.toFixed(3)}** — ${riskIcon}\n`;
        report += `• Borrow APY: ${p.borrowApy.toFixed(2)}%\n\n`;
      });

      if (isCritical) {
        report += `🚨 **ALERTA CRÍTICA DE LIQUIDACIÓN**: Tienes posiciones con HF < 1.05 a punto de ser liquidadas por bots MEV (penalización del 5%).\n`;
        report += `💡 **Recomendación**: Ejecuta un rescate atómico preventivo con Santa Rosa. Ahorrarás un **95%** en penalizaciones mediante un flash loan de Morpho Blue al 0.00% fee.`;
      }

      if (callback) {
        callback({
          text: report,
          content: { userAddress, positions, isCritical },
        });
      }

      return true;
    } catch (err: any) {
      console.error("[MONITOR_DEBT_POSITIONS] Error:", err);
      if (callback) {
        callback({
          text: `❌ Error al consultar posiciones en Base L2: ${err.message}`,
        });
      }
      return false;
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Revisa mis posiciones de deuda en Base para 0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c" },
      },
      {
        user: "{{agent}}",
        content: {
          text: "Voy a escanear tus posiciones en Morpho Blue y Aave v3 en Base L2...",
          action: "MONITOR_DEBT_POSITIONS",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Tengo riesgo de liquidación en mi vault de Morpho?" },
      },
      {
        user: "{{agent}}",
        content: {
          text: "Consultando el Health Factor de tu posición en Base...",
          action: "MONITOR_DEBT_POSITIONS",
        },
      },
    ],
  ] as ActionExample[][],
};
