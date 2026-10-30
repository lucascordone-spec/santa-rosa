async function scanMore() {
  const q = `
  query {
    marketPositions(
      first: 50,
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
        healthFactor_gte: 1.00,
        healthFactor_lte: 1.35,
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

  const res = await fetch('https://api.morpho.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  const json = await res.json();
  const items = json.data?.marketPositions?.items || [];
  const filtered = items.filter(i => (i.state.borrowAssetsUsd || 0) > 1000);

  console.log(`Encontradas ${filtered.length} posiciones reales con HF 1.00 a 1.35:`);
  filtered.forEach((p, idx) => {
    console.log(`[#${idx+1}] ${p.user.address} | ${p.market.collateralAsset?.symbol}/${p.market.loanAsset?.symbol} | Deuda: $${Math.round(p.state.borrowAssetsUsd)} | HF: ${Number(p.healthFactor).toFixed(4)}`);
  });
}
scanMore();
