async function scan() {
  const q = `
  query {
    marketPositions(
      first: 50,
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
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
    console.log(`\n======================================================`);
    console.log(`🔍 POSICIONES REALES EN BASE L2 (ChainId: 8453)`);
    console.log(`Ordenadas por menor Health Factor (más cerca de ser liquidadas)`);
    console.log(`======================================================\n`);

    const atRisk = items.filter(i => i.healthFactor !== null && i.state.borrowAssetsUsd > 100);

    atRisk.slice(0, 15).forEach((p, index) => {
      const hf = Number(p.healthFactor).toFixed(4);
      const borrowUsd = Math.round(p.state.borrowAssetsUsd || 0);
      const collatUsd = Math.round(p.state.collateralUsd || 0);
      const lltv = (Number(p.market.lltv) / 1e16).toFixed(1) + '%';
      const collatSym = p.market.collateralAsset?.symbol || 'UNKNOWN';
      const loanSym = p.market.loanAsset?.symbol || 'UNKNOWN';

      console.log(`[#${index + 1}] User: ${p.user.address}`);
      console.log(`     Par: ${collatSym} / ${loanSym} (LLTV: ${lltv})`);
      console.log(`     Deuda: $${borrowUsd.toLocaleString()} USD | Colateral: $${collatUsd.toLocaleString()} USD`);
      console.log(`     Health Factor: ${hf} ${Number(hf) < 1.08 ? '⚠️ CRÍTICO' : '🟡 En Observación'}`);
      console.log(`------------------------------------------------------`);
    });

    return atRisk;
  } catch (err) {
    console.error('Error scanning positions:', err);
  }
}

scan();
