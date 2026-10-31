import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type ActionExample,
} from "@elizaos/core";
import {
  SANTA_ROSA_DEFAULT_GATEWAY,
  SANTA_ROSA_ROUTER_BASE,
  DEFAULT_PARTNER_WALLET,
} from "../constants.js";
import { type ReadyToSignTransaction } from "../types.js";

export const executeRescueAction: Action = {
  name: "EXECUTE_DEBT_RESCUE",
  similes: [
    "BUILD_RESCUE_TRANSACTION",
    "RESCUE_DEBT_POSITION",
    "DELEVERAGE_ATOMIC_FLASH_LOAN",
    "PROTECT_POSITION_NOW",
  ],
  description:
    "Generates ready-to-sign EVM calldata targeting Santa Rosa Router on Base Mainnet (0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57) to execute atomic 0% flash loan rescue and disburse 0.05% builder revenue share.",

  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || "";
    return (
      (text.includes("execute") ||
        text.includes("build") ||
        text.includes("reparar") ||
        text.includes("proteger") ||
        text.includes("ejecutar")) &&
      (text.includes("rescue") || text.includes("rescate") || text.includes("transaccion"))
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
      const amounts = text.match(/\$?[0-9]+([,.][0-9]+)?/g)?.map((s: string) => Number(s.replace(/[\$,]/g, ""))) || [];
      const amount = amounts[0] || 50000;

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
            name: "build_rescue_transaction",
            arguments: {
              protocol: "MORPHO",
              loanToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC Base
              amount,
              referralAddress: partnerWallet,
            },
          },
        }),
      });

      const json = (await res.json()) as any;
      const textResult = json.result?.content?.[0]?.text;
      const txPayload: ReadyToSignTransaction = textResult ? JSON.parse(textResult) : null;

      if (!txPayload) {
        throw new Error("No se pudo construir la transacción.");
      }

      let reply = `⚡ **[Transacción de Rescate Lista para Firmar]**\n\n`;
      reply += `📋 **Destino**: \`${txPayload.to}\` (Router Santa Rosa en Base Mainnet)\n`;
      reply += `🌐 **Red**: Base L2 (ChainId: 8453)\n`;
      reply += `💎 **Protocolo Objetivo**: ${txPayload.targetProtocol} con Flash Loan Morpho Blue (0.00% fee)\n`;
      reply += `💰 **Monto a Desapalancar**: $${amount.toLocaleString()} USDC\n`;
      reply += `🤝 **Builder Referral Wallet**: \`${txPayload.referral}\` (Recibe 0.05% atómico)\n`;
      reply += `⛽ **Estimación de Gas**: ${txPayload.gasEstimateL2}\n`;
      reply += `🔒 **Garantía Invariante**: Ejecución 100% atómica; si no se alcanza el nuevo Health Factor seguro, revierte completamente sin pérdida de fondos.`;

      if (callback) {
        callback({
          text: reply,
          content: { txPayload },
        });
      }

      return true;
    } catch (err: any) {
      console.error("[EXECUTE_DEBT_RESCUE] Error:", err);
      if (callback) {
        callback({
          text: `❌ Error al construir transacción de rescate: ${err.message}`,
        });
      }
      return false;
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Ejecuta el rescate de mi deuda para evitar liquidación" },
      },
      {
        user: "{{agent}}",
        content: {
          text: "Construyendo la transacción de rescate atómico apuntando al Router de Santa Rosa en Base...",
          action: "EXECUTE_DEBT_RESCUE",
        },
      },
    ],
  ] as ActionExample[][],
};
