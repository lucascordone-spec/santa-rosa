async function runTop20Simulations() {
  const q = `
  query {
    marketPositions(
      first: 100,
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
        healthFactor_gte: 1.00,
        borrowShares_gte: "100"
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

  console.log("=========================================================================================================");
  console.log("🔍 OBTENIENDO LAS 20 POSICIONES MÁS URGENTES EN BASE L2 (MERCADOS MORPHO) PARA PASAR POR NUESTRA API");
  console.log("=========================================================================================================\n");

  const morphoRes = await fetch("https://api.morpho.org/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  });
  const json = await morphoRes.json();
  const items = json.data?.marketPositions?.items || [];
  
  // Filtrar las que tienen deuda activa > $1 USD
  const activePositions = items.filter(
    p => p.healthFactor !== null && (p.state.borrowAssetsUsd || 0) >= 1
  );

  const top20 = activePositions.slice(0, 20);

  console.log(`Posiciones encontradas con deuda activa y HF >= 1.00: ${activePositions.length}. Tomando las 20 más urgentes.\n`);

  let totalDebt = 0;
  let totalPenalty = 0;
  let totalFlashShiftFee = 0;
  let totalPartnerFee = 0;
  let totalNetSavings = 0;

  const tableRows = [];

  for (let i = 0; i < top20.length; i++) {
    const p = top20[i];
    const user = p.user.address;
    const debt = Number(p.state.borrowAssetsUsd);
    const collat = Number(p.state.collateralUsd);
    const hf = Number(p.healthFactor).toFixed(4);
    const pair = `${p.market.collateralAsset?.symbol || 'N/A'}/${p.market.loanAsset?.symbol || 'N/A'}`;
    const lltvBps = Number(p.market.lltv) / 1e14;

    // CONSULTA DIRECTA A NUESTRA API: POST /v1/simulate/rescue
    const apiRes = await fetch("http://localhost:3000/v1/simulate/rescue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress: user,
        currentDebtUsd: debt,
        currentCollateralUsd: collat,
        debtToRepayUsd: debt,
        lltvBps: lltvBps,
        referralAddress: "0x2222222222222222222222222222222222222222"
      })
    });

    const resJson = await apiRes.json();
    const fc = resJson.simulation.financialComparison;

    totalDebt += debt;
    totalPenalty += fc.liquidationPenaltyIfLiquidatedUsd;
    totalFlashShiftFee += fc.protocolFeeUsd;
    totalPartnerFee += fc.builderFeeUsd;
    totalNetSavings += fc.netMoneySavedUsd;

    tableRows.push({
      idx: i + 1,
      user,
      pair,
      hf,
      debt,
      penalty: fc.liquidationPenaltyIfLiquidatedUsd,
      flashShiftFee: fc.protocolFeeUsd,
      partnerFee: fc.builderFeeUsd,
      netSaved: fc.netMoneySavedUsd
    });
  }

  // Imprimir tabla
  console.log("-----------------------------------------------------------------------------------------------------------------------------");
  console.log(
    " #  | Billetera (User en Base)                     | Par           | HF      | Deuda (USD) | Castigo 5% Evitado | FlashShift (80%) | Partner (20%) | Ahorro Usuario"
  );
  console.log("----|--------------------------------------------|---------------|---------|-------------|--------------------|------------------|---------------|----------------");

  tableRows.forEach(r => {
    const pad = (s, n) => s.toString().padEnd(n);
    const padNum = (n, len) => ('$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).padStart(len);
    console.log(
      `${pad(r.idx, 3)} | ${pad(r.user, 42)} | ${pad(r.pair, 13)} | ${pad(r.hf, 7)} | ${padNum(r.debt, 11)} | ${padNum(r.penalty, 18)} | ${padNum(r.flashShiftFee, 16)} | ${padNum(r.partnerFee, 13)} | ${padNum(r.netSaved, 15)}`
    );
  });

  console.log("-----------------------------------------------------------------------------------------------------------------------------");
  console.log("\n📊 TOTALES GENERALES DEL LOTE DE LAS 20 LIQUIDACIONES:");
  console.log(`   💰 Deuda Total Rescatada:              $${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);
  console.log(`   ❌ Castigo de Liquidación Evitado:     $${totalPenalty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);
  console.log(`   ⚡ Ganancia Neta FlashShift (0.20%):   $${totalFlashShiftFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (Para tu tesorería)`);
  console.log(`   🤝 Ganancia Neta Partner (0.05%):      $${totalPartnerFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (Para las wallets de los bots)`);
  console.log(`   🛡️ AHORRO TOTAL NETO PARA USUARIOS:    $${totalNetSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);
  console.log("=============================================================================================================================");
}

runTop20Simulations().catch(console.error);
