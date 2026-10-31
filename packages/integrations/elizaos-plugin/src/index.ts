import { type Plugin } from "@elizaos/core";
import { monitorPositionsAction } from "./actions/monitorPositions.js";
import { simulateRescueAction } from "./actions/simulateRescue.js";
import { executeRescueAction } from "./actions/executeRescue.js";
import { positionProvider } from "./providers/positionProvider.js";

export * from "./types.js";
export * from "./constants.js";
export * from "./actions/monitorPositions.js";
export * from "./actions/simulateRescue.js";
export * from "./actions/executeRescue.js";
export * from "./providers/positionProvider.js";

/**
 * Santa Rosa Plugin for ElizaOS
 * Equips Eliza agents with autonomous DeFi liquidation defense, Morpho flash loan deleveraging,
 * and automated 0.05% builder revenue sharing on Base L2.
 */
export const santaRosaPlugin: Plugin = {
  name: "santa-rosa",
  description:
    "Autonomous DeFi debt rescue and 0% Morpho flash loan execution router on Base L2 with 80/20 builder revenue share.",
  actions: [
    monitorPositionsAction,
    simulateRescueAction,
    executeRescueAction,
  ],
  providers: [positionProvider],
  evaluators: [],
  services: [],
};

export default santaRosaPlugin;
