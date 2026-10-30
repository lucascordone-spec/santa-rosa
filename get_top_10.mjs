async function getNextTenPositions() {
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

  const res = await fetch('https://api.morpho.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  const json = await res.json();
  const items = json.data?.marketPositions?.items || [];
  
  // Filtrar posiciones que tengan deuda significativa en USD (> $100)
  const withDebt = items.filter(p => (p.state.borrowAssetsUsd || 0) >= 100 && p.healthFactor !== null);

  console.log(`Encontradas ${withDebt.length} posiciones solventes con deuda activa en Base L2.`);
  return withDebt.slice(0, 10);
}

getNextTenPositions().then(positions => {
  positions.forEach((p, i) => {
    console.log(`[#${i+1}] ${p.user.address} | HF: ${Number(p.healthFactor).toFixed(4)} | Deuda: $${Math.round(p.state.borrowAssetsUsd)} | Collat: $${Math.round(p.state.collateralUsd)} | ${p.market.collateralAsset?.symbol}/${p.market.loanAsset?.symbol}`);
  });
});
