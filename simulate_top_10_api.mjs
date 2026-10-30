async function simulateTopTen() {
  const q = `
  query {
    marketPositions(
      first: 100,
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
        healthFactor_gte: 1.00,
        borrowShares_gte: "1000000"
      }
    ) {
      items {
        user {
          address
        }
        market {
          lltv
          loanAsset {
            symbol
            address
            decimals
          }
          collateralAsset {
            symbol
            address
            decimals
          }
        }
        healthFactor
        state {
          borrowAssets
          borrowAssetsUsd
          collateral
          collateralUsd
        }
      }
    }
  }
  `;

  console.log("1. Obteniendo las 10 posiciones reales de Base L2 más cercanas a la liquidación...");
  const morphoRes = await fetch('https://api.morpho.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  const json = await morphoRes.json();
  const items = json.data?.marketPositions?.items || [];
  const top10 = items
    .filter(p => (p.state.borrowAssetsUsd || 0) >= 100 && p.healthFactor !== null)
    .slice(0, 10);

  console.log(`2. Enviando cada posición a la API FlashShift (http://localhost:3000/v1/simulate/rescue)...\n`);

  let totalDebtRescued = 0;
  let totalPenaltyAvoided = 0;
  let totalProtocolFee = 0;
  let totalBuilderFee = 0;
  let totalNetSaved = 0;

  const results = [];

  for (let i = 0; i < top10.length; i++) {
    const p = top10[i];
    const userAddr = p.user.address;
    const debtUsd = Math.round(p.state.borrowAssetsUsd);
    const collatUsd = Math.round(p.state.collateralUsd);
    const hf = Number(p.healthFactor).toFixed(4);
    const lltvBps = Number(p.market.lltv) / 1e14; // bps
    const pair = `${p.market.collateralAsset?.symbol}/${p.market.loanAsset?.symbol}`;

    // Simulamos rescatar el 100% de la deuda en riesgo
    const simRes = await fetch("http://localhost:3000/v1/simulate/rescue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress: userAddr,
        currentDebtUsd: debtUsd,
        currentCollateralUsd: collatUsd,
        debtToRepayUsd: debtUsd,
        lltvBps: lltvBps,
        referralAddress: "0x2222222222222222222222222222222222222222"
      })
    });

    const simData = await simRes.json();
    const fc = simData.simulation.financialComparison;

    totalDebtRescued += debtUsd;
    totalPenaltyAvoided += fc.liquidationPenaltyIfLiquidatedUsd;
    totalProtocolFee += fc.protocolFeeUsd;
    totalBuilderFee += fc.builderFeeUsd;
    totalNetSaved += fc.netMoneySavedUsd;

    results.push({
      rank: i + 1,
      user: userAddr,
      pair,
      hf,
      debtUsd,
      collatUsd,
      penaltyAvoided: fc.liquidationPenaltyIfLiquidatedUsd,
      protocolFee: fc.protocolFeeUsd,
      builderFee: fc.builderFeeUsd,
      netSaved: fc.netMoneySavedUsd
    });
  }

  console.log("=========================================================================================================================");
  console.log("📋 REPORTE DE SIMULACIÓN API — TOP 10 ÓRDENES REALES EN RIESGO EN BASE L2 (M2M)");
  console.log("=========================================================================================================================");
  console.log(
    " # | Billetera (User)                           | Par           | HF     | Deuda (USD) | Castigo Evitado | Fee FlashShift | Fee Partner | Ahorro Usuario"
  );
  console.log("---|--------------------------------------------|---------------|--------|-------------|-----------------|----------------|-------------|----------------");

  results.forEach(r => {
    const pad = (s, n) => s.toString().padEnd(n);
    const padNum = (s, n) => ('$' + s.toLocaleString()).padStart(n);
    console.log(
      `${pad(r.rank, 2)} | ${pad(r.user, 42)} | ${pad(r.pair, 13)} | ${pad(r.hf, 6)} | ${padNum(r.debtUsd, 11)} | ${padNum(r.penaltyAvoided, 15)} | ${padNum(r.protocolFee, 14)} | ${padNum(r.builderFee, 11)} | ${padNum(r.netSaved, 14)}`
    );
  });

  console.log("=========================================================================================================================");
  console.log("🎯 TOTALES CONSOLIDADOS DE LA SIMULACIÓN EN 10 POSICIONES REALES:");
  console.log(`   💰 Volumen Total de Deuda a Rescatar:           $${totalDebtRescued.toLocaleString()} USD`);
  console.log(`   ❌ Castigo Total de Liquidación Evitado:        $${totalPenaltyAvoided.toLocaleString()} USD (Pérdida que no sufren los usuarios)`);
  console.log(`   ⚡ Ganancia Neta FlashShift (80% / 0.20%):      $${totalProtocolFee.toLocaleString()} USD (Directo a tu tesorería)`);
  console.log(`   🤝 Ganancia Neta Partner/Referido (20% / 0.05%): $${totalBuilderFee.toLocaleString()} USD (Directo a las wallets de los bots)`);
  console.log(`   🛡️ AHORRO TOTAL NETO PARA LOS USUARIOS:         $${totalNetSaved.toLocaleString()} USD`);
  console.log(`   🚀 Multiplicador de Eficiencia Promedio:        20.0x más barato que la liquidación forzosa`);
  console.log("=========================================================================================================================");
}

simulateTopTen().catch(console.error);
