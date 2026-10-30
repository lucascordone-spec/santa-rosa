const fetch = globalThis.fetch || require("node-fetch");

const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function testParams(amountUsd) {
  const rawAmountIn = (BigInt(amountUsd) * 10n ** 18n).toString();
  
  // 1. Default (saveGas por defecto)
  const urlDefault = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${USDC}&amountIn=${rawAmountIn}`;
  const res1 = await fetch(urlDefault, { headers: { "x-client-id": "flashshift" } });
  const data1 = await res1.json();
  const outDefault = Number(data1.data?.routeSummary?.amountOutUsd || 0);

  // 2. Optimizado según documentación (saveGas=0 para priorizar retorno máximo sobre gas)
  const urlNoGasSave = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${USDC}&amountIn=${rawAmountIn}&saveGas=0`;
  const res2 = await fetch(urlNoGasSave, { headers: { "x-client-id": "flashshift" } });
  const data2 = await res2.json();
  const outNoGasSave = Number(data2.data?.routeSummary?.amountOutUsd || 0);

  console.log(`\n======================================================`);
  console.log(`TEST KYBER PARAMS: $${amountUsd.toLocaleString()} USDe -> USDC`);
  console.log(`- Default Out:    $${outDefault.toLocaleString()} (Slippage: ${(((amountUsd - outDefault) / amountUsd) * 100).toFixed(2)}%)`);
  console.log(`- saveGas=0 Out:  $${outNoGasSave.toLocaleString()} (Slippage: ${(((amountUsd - outNoGasSave) / amountUsd) * 100).toFixed(2)}%)`);
  console.log(`- Diferencia:     +$${(outNoGasSave - outDefault).toFixed(2)} USD`);
}

async function run() {
  await testParams(100000);
  await testParams(300000);
  await testParams(500000);
}

run();
