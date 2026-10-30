// Busca la posición de la ballena #1 exacta con sus market params completos
const q = `{
  userByAddress(address: "0x7bee8D37FBA61a6251a08b957d502C56E2A50FAb", chainId: 8453) {
    marketPositions {
      market {
        marketId
        lltv
        oracle { address }
        irmAddress
        loanAsset { address symbol decimals }
        collateralAsset { address symbol decimals }
      }
      state {
        borrowAssets
        borrowAssetsUsd
        collateral
        collateralUsd
      }
      healthFactor
    }
  }
}`;

const res = await fetch("https://api.morpho.org/graphql", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query: q }),
});
const j = await res.json();
console.log(JSON.stringify(j.data.userByAddress.marketPositions[0], null, 2));
