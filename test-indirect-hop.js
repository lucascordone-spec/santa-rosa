const fetch = globalThis.fetch || require("node-fetch");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";

async function testIndirectHop(amountUsd) {
  console.log(`\n======================================================`);
  console.log(`PROBANDO SALTO INTERMEDIO: USDe -> WETH -> USDC ($${amountUsd.toLocaleString()} USD)`);
  console.log(`======================================================`);

  // Paso 1: USDe -> WETH
  const rawUsde = (BigInt(amountUsd) * 10n ** 18n).toString();
  const url1 = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${WETH}&amountIn=${rawUsde}&saveGas=0`;
  const res1 = await fetch(url1, { headers: { "x-client-id": "flashshift" } });
  const data1 = await res1.json();
  const summary1 = data1.data?.routeSummary;

  if (!summary1) {
    console.log("No route for USDe -> WETH");
    return;
  }

  const wethReceivedUsd = Number(summary1.amountOutUsd);
  console.log(`Paso 1 (USDe -> WETH): Entregó $${wethReceivedUsd.toLocaleString()} USD en WETH`);

  // Paso 2: WETH -> USDC con la liquidez profunda de 14 caminos
  const rawWethIn = summary1.amountOut;
  const url2 = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${WETH}&tokenOut=${USDC}&amountIn=${rawWethIn}&saveGas=0`;
  const res2 = await fetch(url2, { headers: { "x-client-id": "flashshift" } });
  const data2 = await res2.json();
  const summary2 = data2.data?.routeSummary;

  if (!summary2) {
    console.log("No route for WETH -> USDC");
    return;
  }

  const finalUsdc = Number(summary2.amountOutUsd);
  const totalSlippage = ((amountUsd - finalUsdc) / amountUsd) * 100;

  console.log(`Paso 2 (WETH -> USDC): Entregó $${finalUsdc.toLocaleString()} USDC finales`);
  console.log(`Slippage total por salto indirecto: ${totalSlippage.toFixed(2)}%`);
}

async function run() {
  await testIndirectHop(250000);
  await testIndirectHop(500000);
}

run();
