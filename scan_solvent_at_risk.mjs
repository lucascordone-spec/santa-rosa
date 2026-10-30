async function scanSolventAtRisk() {
  const q = `
  query {
    marketPositions(
      first: 50,
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
        healthFactor_gte: 1.00,
        healthFactor_lte: 1.20,
        borrowShares_gte: "1000000"
      }
    ) {
      items {
        user {
          address
        }
        market {
          lltv
          oracle { address }
          irmAddress
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

  try {
    const res = await fetch('https://api.morpho.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
      return;
    }

    const items = json.data?.marketPositions?.items || [];
    console.log(`\n========================================================================`);
    console.log(`🎯 POSICIONES ACTIVAS VIVAS EN BASE EN RIESGO DE LIQUIDACIÓN (HF 1.00 - 1.20)`);
    console.log(`========================================================================\n`);

    const filtered = items.filter(i => (i.state.borrowAssetsUsd || 0) > 1000);

    if (filtered.length === 0) {
      console.log('No hay posiciones con HF entre 1.00 y 1.20 en este bloque exacto con deuda > $1000.');
      console.log('Buscando con rango más amplio (1.00 a 1.50)...');
      return;
    }

    filtered.forEach((p, idx) => {
      const hf = Number(p.healthFactor).toFixed(4);
      const borrowUsd = Math.round(p.state.borrowAssetsUsd || 0);
      const collatUsd = Math.round(p.state.collateralUsd || 0);
      const lltv = (Number(p.market.lltv) / 1e16).toFixed(1) + '%';
      const collatSym = p.market.collateralAsset?.symbol || 'UNKNOWN';
      const loanSym = p.market.loanAsset?.symbol || 'UNKNOWN';

      console.log(`[#${idx + 1}] Billetera: ${p.user.address}`);
      console.log(`     Mercado: ${collatSym} / ${loanSym} (LLTV: ${lltv})`);
      console.log(`     Deuda: $${borrowUsd.toLocaleString()} USD | Colateral: $${collatUsd.toLocaleString()} USD`);
      console.log(`     Health Factor: ${hf}`);
      console.log(`------------------------------------------------------------------------`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

scanSolventAtRisk();
