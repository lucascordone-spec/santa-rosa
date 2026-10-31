import fs from "fs";

async function scanAll() {
  console.log("================================================================================");
  console.log("🔍 ESCANEO GLOBAL: TODAS LAS POSICIONES AL BORDE DE LIQUIDACIÓN EN BASE L2");
  console.log("   Protocolo: Morpho Blue Base (ChainId: 8453) | Rango HF: 1.0000 - 1.0800");
  console.log("================================================================================\n");

  const query = `
    query {
      marketPositions(
        first: 200,
        orderBy: HealthFactor,
        orderDirection: Asc,
        where: {
          chainId_in: [8453],
          healthFactor_gte: 1.0000,
          healthFactor_lte: 1.1000
        }
      ) {
        items {
          user { address }
          market {
            uniqueKey
            lltv
            loanAsset { symbol address decimals }
            collateralAsset { symbol address decimals }
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

  let allPositions = [];

  try {
    const res = await fetch("https://api.morpho.org/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    allPositions = json.data?.marketPositions?.items || [];
  } catch (err) {
    console.error("Error fetching Morpho positions:", err.message);
  }

  // Filtrar con deuda activa >= $10 USD
  const active = allPositions.filter(p => p.healthFactor !== null && (p.state?.borrowAssetsUsd || 0) >= 10);
  
  console.log(`📊 Posiciones totales detectadas con deuda activa y HF 1.00 - 1.08: ${active.length}\n`);

  let totalDebt = 0;
  let totalSaved = 0;
  let totalTreasuryFee = 0;
  let totalKeeperFee = 0;

  active.forEach(p => {
    const debt = p.state.borrowAssetsUsd || 0;
    totalDebt += debt;
    totalSaved += debt * 0.0475; // 5% penalización liquidadores - 0.25% fee Santa Rosa
    totalTreasuryFee += debt * 0.0020; // 0.20% para la tesorería
    totalKeeperFee += debt * 0.0005;   // 0.05% para el keeper/referral
  });

  console.log("--------------------------------------------------------------------------------");
  console.log("💰 RESUMEN FINANCIERO CONSOLIDADO (BASE L2):");
  console.log(`   ├─ Volumen Total en Riesgo de Liquidación:  $${totalDebt.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD`);
  console.log(`   ├─ Ahorro Neto Total para los Usuarios:      $${totalSaved.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD`);
  console.log(`   ├─ 💸 GANANCIA DIRECTA TESORERÍA (0.20%):   +$${totalTreasuryFee.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC`);
  console.log(`   └─ 🤝 GANANCIA PARA REFERIDOS/KEEPERS (0.05%):+$${totalKeeperFee.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC`);
  console.log("--------------------------------------------------------------------------------\n");

  // Clasificación por rangos
  const critical = active.filter(p => p.healthFactor < 1.02);
  const urgent = active.filter(p => p.healthFactor >= 1.02 && p.healthFactor < 1.05);
  const warning = active.filter(p => p.healthFactor >= 1.05);

  console.log(`🚨 Posiciones Críticas (HF < 1.02): ${critical.length} (${critical.map(p => "$" + Math.round(p.state.borrowAssetsUsd).toLocaleString()).join(", ")})`);
  console.log(`⚠️ Posiciones Urgentes (HF 1.02 - 1.05): ${urgent.length}`);
  console.log(`⚡ Posiciones en Advertencia (HF 1.05 - 1.08): ${warning.length}\n`);

  // Guardar catálogo JSON completo para el bot despachador
  const exportData = active.map(p => ({
    wallet: p.user.address,
    pair: `${p.market.collateralAsset?.symbol || "N/A"}/${p.market.loanAsset.symbol}`,
    loanTokenAddress: p.market.loanAsset.address,
    collateralTokenAddress: p.market.collateralAsset?.address,
    healthFactor: Number(p.healthFactor.toFixed(5)),
    debtUsd: Number((p.state.borrowAssetsUsd || 0).toFixed(2)),
    collateralUsd: Number((p.state.collateralUsd || 0).toFixed(2)),
    projectedTreasuryFeeUsd: Number(((p.state.borrowAssetsUsd || 0) * 0.002).toFixed(2)),
    projectedKeeperFeeUsd: Number(((p.state.borrowAssetsUsd || 0) * 0.0005).toFixed(2)),
    userSavingsUsd: Number(((p.state.borrowAssetsUsd || 0) * 0.0475).toFixed(2))
  }));

  fs.writeFileSync("./packages/sentinel-keeper/all-at-risk-positions.json", JSON.stringify(exportData, null, 2));
  console.log("📁 Catálogo guardado en: packages/sentinel-keeper/all-at-risk-positions.json\n");

  console.log("📋 TOP 20 POSICIONES MÁS RENTABLES PARA RESCATAR (MAYOR INGRESO EN FEES):");
  const sortedByFee = [...exportData].sort((a, b) => b.debtUsd - a.debtUsd);
  sortedByFee.slice(0, 20).forEach((item, index) => {
    console.log(
      `${(index + 1).toString().padStart(2, " ")}. Wallet: ${item.wallet} | Par: ${item.pair.padEnd(12, " ")} | HF: ${item.healthFactor.toFixed(4)} | Deuda: $${item.debtUsd.toLocaleString().padStart(12, " ")} | Fee Tesorería: +$${item.projectedTreasuryFeeUsd.toLocaleString().padStart(9, " ")} USDC`
    );
  });
}

scanAll().catch(console.error);
