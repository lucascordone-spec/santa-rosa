const fetch = globalThis.fetch || require("node-fetch");

async function checkPMMsOnKyber() {
  const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const WETH = "0x4200000000000000000000000000000000000006";

  console.log("Consultando fuentes PMM/RFQ disponibles en KyberSwap Base L2...");

  // Probamos con WETH -> USDC a $1M
  const rawWeth = (500n * 10n ** 18n).toString(); // ~$1.1M USD
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${WETH}&tokenOut=${USDC}&amountIn=${rawWeth}`;
  const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
  const data = await res.json();
  const summary = data.data?.routeSummary;

  if (summary && summary.route) {
    console.log("\nFuentes usadas para $1.1M WETH -> USDC en Kyber:");
    const pmmSources = [];
    const ammSources = [];
    for (const subRoute of summary.route) {
      for (const step of subRoute) {
        if (step.exchange.includes("pmm") || step.exchange.includes("bebop") || step.exchange.includes("prop")) {
          pmmSources.push(`${step.exchange} (Pool: ${step.pool})`);
        } else {
          ammSources.push(step.exchange);
        }
      }
    }
    console.log("- Fuentes PMM/RFQ con 0% Slippage:", Array.from(new Set(pmmSources)));
    console.log("- Fuentes AMM estándar:", Array.from(new Set(ammSources)));
    console.log("- AmountOut USD:", summary.amountOutUsd);
    console.log("- Slippage total:", (((Number(summary.amountInUsd) - Number(summary.amountOutUsd)) / Number(summary.amountInUsd)) * 100).toFixed(2) + "%");
  }
}

checkPMMsOnKyber();
