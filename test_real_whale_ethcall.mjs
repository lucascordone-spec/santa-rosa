async function runRealRescueSimulation() {
  const targetWallet = "0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c";
  const debtUsd = 40976;
  const collatUsd = 42536;
  const debtToRepay = 15000; // Desapalancar $15k para blindar la posición
  const lltvBps = 9650; // 96.5% LLTV en wstETH/WETH
  const partnerAddress = "0x2222222222222222222222222222222222222222";

  console.log("================================================================================");
  console.log("🚀 EJECUTANDO SIMULACIÓN DE RESCATE (ETH_CALL) SOBRE POSICIÓN REAL EN BASE L2");
  console.log("================================================================================");
  console.log(`📍 Billetera Real Detectada: ${targetWallet}`);
  console.log(`📊 Mercado Morpho: wstETH / WETH (LLTV 96.5%)`);
  console.log(`⚠️ Health Factor Actual: 1.0006 (¡A 0.06% DE SER LIQUIDADA POR BOTS DE MEV!)`);
  console.log(`💰 Deuda Actual: $${debtUsd.toLocaleString()} USD`);
  console.log(`🛡️ Colateral Actual: $${collatUsd.toLocaleString()} USD`);
  console.log("--------------------------------------------------------------------------------");

  // 1. Simulación a través de la API Headless de FlashShift
  const res = await fetch("http://localhost:3000/v1/simulate/rescue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userAddress: targetWallet,
      currentDebtUsd: debtUsd,
      currentCollateralUsd: collatUsd,
      debtToRepayUsd: debtToRepay,
      lltvBps: lltvBps,
      referralAddress: partnerAddress
    })
  });

  const data = await res.json();
  const f = data.simulation.financialComparison;

  console.log("\n📈 RESULTADOS DE LA EVALUACIÓN FINANCIERA (GASLESS ETH_CALL):");
  console.log(`❌ Penalización si un Liquidador externo lo agarra (5.00%):  -$${f.liquidationPenaltyIfLiquidatedUsd.toLocaleString()} USD (Pérdida neta del usuario)`);
  console.log(`⚡ Costo Total FlashShift (0.25% atómico):                     $${f.flashShiftFeeUsd.toLocaleString()} USD`);
  console.log(`   ├─ Comisión FlashShift (0.20% / 80%):                      $${f.protocolFeeUsd.toLocaleString()} USD`);
  console.log(`   └─ Comisión Partner / Bot Ref (0.05% / 20%):               $${f.builderFeeUsd.toLocaleString()} USD (Directo a la wallet)`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`✅ AHORRO NETO EN EL BOLSILLO DEL USUARIO:                    +$${f.netMoneySavedUsd.toLocaleString()} USD`);
  console.log(`🚀 Eficiencia: ${f.savingsMultiplier}`);
  console.log("================================================================================\n");

  // 2. Cotización y Calldata de Construcción de Tx para el Bot
  const buildRes = await fetch("http://localhost:3000/v1/build-tx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actionType: "RESCUE",
      protocol: "MORPHO",
      loanToken: "0x4200000000000000000000000000000000000006", // WETH en Base
      amount: debtToRepay,
      referralAddress: partnerAddress
    })
  });
  const txData = await buildRes.json();

  console.log("📦 PAYLOAD LISTO PARA TRANSMISIÓN POR EL BOT (M2M):");
  console.log(JSON.stringify(txData, null, 2));
}

runRealRescueSimulation();
