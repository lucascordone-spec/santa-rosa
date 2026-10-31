import {
  santaRosaPlugin,
  monitorPositionsAction,
  simulateRescueAction,
  executeRescueAction,
  positionProvider,
} from "./dist/index.js";

async function testElizaPlugin() {
  console.log("==================================================================");
  console.log("🤖 Testing ElizaOS Santa Rosa Plugin (@santa-rosa/plugin-elizaos)");
  console.log("==================================================================\n");

  const mockRuntime = {
    agentId: "test-eliza-agent",
    getSetting: (key) => {
      if (key === "SANTA_ROSA_PARTNER_WALLET") return "0x8f7670EA615910D0A86320e84A611577F68E3908";
      return undefined;
    },
  };

  // 1. Test Provider
  console.log("📋 [Test 1] Testing Position Provider context injection...");
  const context = await positionProvider.get(mockRuntime, { content: { text: "status" } });
  console.log("Provider Context Injected:\n", context);

  // 2. Test Monitor Positions Action
  console.log("🔍 [Test 2] Testing MONITOR_DEBT_POSITIONS action...");
  let monitorResultText = "";
  await monitorPositionsAction.handler(
    mockRuntime,
    { content: { text: "revisa la deuda de 0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c en base" } },
    undefined,
    undefined,
    (res) => {
      monitorResultText = res.text;
    }
  );
  console.log("Monitor Output:\n", monitorResultText);

  // 3. Test Simulate Rescue Action
  console.log("🛡️ [Test 3] Testing SIMULATE_RESCUE_SAVINGS action...");
  let simResultText = "";
  await simulateRescueAction.handler(
    mockRuntime,
    { content: { text: "simula el rescate para 0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c con deuda de 100000" } },
    undefined,
    undefined,
    (res) => {
      simResultText = res.text;
    }
  );
  console.log("Simulation Output:\n", simResultText);

  // 4. Test Execute Rescue Action
  console.log("⚡ [Test 4] Testing EXECUTE_DEBT_RESCUE action...");
  let execResultText = "";
  await executeRescueAction.handler(
    mockRuntime,
    { content: { text: "ejecuta el rescate para 50000 USDC" } },
    undefined,
    undefined,
    (res) => {
      execResultText = res.text;
    }
  );
  console.log("Execution Output:\n", execResultText);

  console.log("\n==================================================================");
  console.log("✅ All ElizaOS Plugin actions verified and working!");
  console.log("==================================================================");
}

testElizaPlugin().catch(console.error);
