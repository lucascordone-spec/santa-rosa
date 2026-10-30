const fetch = globalThis.fetch || require("node-fetch");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
const cbETH = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22";

async function queryKyberRoute(tokenIn, tokenOut, amountUsd, unitPriceIn) {
  const unitsIn = amountUsd / unitPriceIn;
  const rawAmountIn = BigInt(Math.floor(unitsIn * 1e18)).toString();

  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}&saveGas=0`;
  const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
  const data = await res.json();
  const summary = data.data?.routeSummary;

  if (!summary) {
    console.log(`- $${amountUsd.toLocaleString()} USD: No route found`);
    return null;
  }

  const amountInUsd = Number(summary.amountInUsd);
  const amountOutUsd = Number(summary.amountOutUsd);
  const slippage = ((amountInUsd - amountOutUsd) / amountInUsd) * 100;

  // Analizar la proporción de PMM vs AMM
  const pmmExchanges = [];
  const ammExchanges = [];

  if (summary.route) {
    for (const subRoute of summary.route) {
      for (const step of subRoute) {
        const ex = step.exchange.toLowerCase();
        if (ex.includes("pmm") || ex.includes("bebop") || ex.includes("prop") || ex.includes("dodo") || ex.includes("woofi")) {
          pmmExchanges.push(step.exchange);
        } else {
          ammExchanges.push(step.exchange);
        }
      }
    }
  }

  return {
    amountUsd,
    amountInUsd,
    amountOutUsd,
    slippage: slippage.toFixed(2),
    pmmCount: pmmExchanges.length,
    ammCount: ammExchanges.length,
    pmmList: Array.from(new Set(pmmExchanges)),
    ammList: Array.from(new Set(ammExchanges))
  };
}

async function runBenchmark() {
  console.log("==================================================================================");
  console.log("  PRUEBA REAL ON-CHAIN DE PMMs (PRIVATE MARKET MAKERS) EN BASE L2");
  console.log("==================================================================================");

  const amounts = [100000, 500000, 1000000, 2500000, 5000000];

  console.log("\n>>> PAR: WETH -> USDC (Verificando absorción institucional por PMMs)");
  for (const amt of amounts) {
    const res = await queryKyberRoute(WETH, USDC, amt, 2223.0);
    if (res) {
      console.log(`- $${res.amountUsd.toLocaleString().padEnd(10)} USD | Out: $${Math.floor(res.amountOutUsd).toLocaleString().padEnd(10)} | Slippage: ${res.slippage}% | PMMs activos: ${res.pmmList.join(", ")}`);
    }
  }

  console.log("\n>>> PAR: cbETH -> WETH (Liquid Staking)");
  for (const amt of [100000, 500000, 1000000, 2500000]) {
    const res = await queryKyberRoute(cbETH, WETH, amt, 2420.0);
    if (res) {
      console.log(`- $${res.amountUsd.toLocaleString().padEnd(10)} USD | Out: $${Math.floor(res.amountOutUsd).toLocaleString().padEnd(10)} | Slippage: ${res.slippage}% | Fuentes: ${res.pmmList.concat(res.ammList).join(", ")}`);
    }
  }
}

runBenchmark();
