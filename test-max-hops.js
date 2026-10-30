const fetch = globalThis.fetch || require("node-fetch");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";

async function testMaxHops(tokenIn, tokenOut, amountUsd, tokenInPrice) {
  const unitsIn = amountUsd / tokenInPrice;
  const rawAmountIn = BigInt(Math.floor(unitsIn * 1e18)).toString();

  // saveGas=0 le dice al enrutador de Kyber que explore la mayor cantidad de saltos y divisiones
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}&saveGas=0`;

  console.log(`\n================================================================`);
  console.log(`KYBER CON MÁXIMOS SALTOS Y AMMs ACTIVOS: $${amountUsd.toLocaleString()} USD`);
  console.log(`================================================================`);

  try {
    const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
    const data = await res.json();
    const summary = data.data?.routeSummary;

    if (!summary) {
      console.log("No route found");
      return;
    }

    const inUsd = Number(summary.amountInUsd);
    const outUsd = Number(summary.amountOutUsd);
    const slippage = ((inUsd - outUsd) / inUsd) * 100;

    console.log(`- AmountIn USD:  $${inUsd.toLocaleString()}`);
    console.log(`- AmountOut USD: $${outUsd.toLocaleString()}`);
    console.log(`- Slippage Real: ${slippage.toFixed(2)}%`);
    console.log(`- Gas Estimado:  ${summary.gas} units ($${Number(summary.gasUsd).toFixed(4)} USD en Base L2)`);

    console.log(`\n- Desglose de Saltos (Hops) y Divisiones (Splits):`);
    let totalHops = 0;
    if (summary.route) {
      console.log(`  Total de Caminos en Paralelo (Splits): ${summary.route.length}`);
      for (let i = 0; i < summary.route.length; i++) {
        const subRoute = summary.route[i];
        totalHops += subRoute.length;
        const pathNames = subRoute.map(s => s.exchange).join(" -> ");
        console.log(`  [Camino ${i + 1}] (${subRoute.length} saltos): ${pathNames}`);
      }
    }
    console.log(`- Total de Piscinas/Saltos Combinados: ${totalHops}`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

async function run() {
  await testMaxHops(WETH, USDC, 500000, 2223.0);
  await testMaxHops(WETH, USDC, 1000000, 2223.0);
  await testMaxHops(USDe, USDC, 250000, 1.0);
  await testMaxHops(USDe, USDC, 500000, 1.0);
}

run();
