async function findPositions() {
  const q = `
  query {
    marketPositions(
      first: 30,
      chainId: 8453,
      orderBy: HealthFactor,
      orderDirection: Asc
    ) {
      items {
        user {
          address
        }
        market {
          uniqueKey
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
      console.log('GraphQL errors:', JSON.stringify(json.errors, null, 2));
      return;
    }

    const items = json.data?.marketPositions?.items || [];
    console.log(`Encontradas ${items.length} posiciones en Morpho Base:`);
    
    for (const pos of items) {
      if (pos.healthFactor && pos.state.borrowAssetsUsd > 100) {
        console.log({
          user: pos.user.address,
          pair: `${pos.market.collateralAsset?.symbol || 'N/A'} / ${pos.market.loanAsset?.symbol || 'N/A'}`,
          healthFactor: Number(pos.healthFactor).toFixed(4),
          borrowUsd: Math.round(pos.state.borrowAssetsUsd),
          collateralUsd: Math.round(pos.state.collateralUsd),
          lltv: Number(pos.market.lltv) / 1e16 + '%'
        });
      }
    }
  } catch (err) {
    console.error('Error fetching Morpho data:', err);
  }
}

findPositions();
