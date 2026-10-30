const fetch = globalThis.fetch || require("node-fetch");

const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function inspectKyberRoute(amountUsd) {
  const rawAmountIn = (BigInt(amountUsd) * 10n ** 18n).toString();
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${USDC}&amountIn=${rawAmountIn}`;
  
  const res = await fetch(url, { headers: { "x-client-id": "flashshift-research" } });
  const data = await res.json();
  const summary = data.data?.routeSummary;

  console.log(`\n======================================================`);
  console.log(`  CONSULTA KYBER: $${amountUsd.toLocaleString()} USDe -> USDC`);
  console.log(`======================================================`);
  
  if (!summary) {
    console.log("No route found");
    return;
  }

  console.log(`- AmountIn USD:  $${Number(summary.amountInUsd).toLocaleString()}`);
  console.log(`- AmountOut USD: $${Number(summary.amountOutUsd).toLocaleString()}`);
  const slippage = ((Number(summary.amountInUsd) - Number(summary.amountOutUsd)) / Number(summary.amountInUsd)) * 100;
  console.log(`- Slippage:      ${slippage.toFixed(2)}%`);

  console.log(`\n- Desglose de Piscinas (Pools) Utilizadas:`);
  if (summary.route) {
    for (let i = 0; i < summary.route.length; i++) {
      const subRoute = summary.route[i];
      for (const step of subRoute) {
        console.log(`  [Pool ${i+1}] DEX: ${step.exchange.padEnd(25)} | SwapAmount: ${step.swapAmount.slice(0, 10)}... | Pool: ${step.pool}`);
      }
    }
  }
}

async function run() {
  // Ver cómo enruta $100k, $250k y $500k
  await inspectKyberRoute(100000);
  await inspectKyberRoute(250000);
  await inspectKyberRoute(500000);
}

run();
