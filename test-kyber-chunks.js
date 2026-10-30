const fetch = globalThis.fetch || require("node-fetch");

const BASE_TOKENS = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  USDe: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
  cbETH: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22"
};

async function getQuote(tokenIn, tokenOut, rawAmountIn) {
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}`;
  const res = await fetch(url, { headers: { "x-client-id": "flashshift-research" } });
  const data = await res.json();
  return data.data?.routeSummary;
}

async function benchmarkSingleVsChunks(tokenInSymbol, tokenOutSymbol, totalUsd, chunksCount) {
  console.log(`\n================================================================`);
  console.log(`  TEST: $${totalUsd.toLocaleString()} USD de ${tokenInSymbol} -> ${tokenOutSymbol}`);
  console.log(`  Estrategia: 1 Swap Masivo vs. ${chunksCount} Chunks de $${(totalUsd / chunksCount).toLocaleString()} USD`);
  console.log(`================================================================`);

  const tIn = BASE_TOKENS[tokenInSymbol];
  const tOut = BASE_TOKENS[tokenOutSymbol];

  // 1. Swap Masivo Único
  const rawTotal = (BigInt(totalUsd) * 10n ** 18n).toString();
  const singleSummary = await getQuote(tIn, tOut, rawTotal);

  let singleOut = 0;
  let singleSlippage = 100;
  if (singleSummary) {
    singleOut = Number(singleSummary.amountOutUsd);
    singleSlippage = ((totalUsd - singleOut) / totalUsd) * 100;
  }

  // 2. Chunks divididos
  const chunkUsd = totalUsd / chunksCount;
  const rawChunk = (BigInt(Math.floor(chunkUsd)) * 10n ** 18n).toString();
  const chunkSummary = await getQuote(tIn, tOut, rawChunk);

  let totalChunkOut = 0;
  let chunkSlippage = 100;
  if (chunkSummary) {
    const singleChunkOut = Number(chunkSummary.amountOutUsd);
    totalChunkOut = singleChunkOut * chunksCount;
    chunkSlippage = ((totalUsd - totalChunkOut) / totalUsd) * 100;
  }

  console.log(`1. SWAP ÚNICO DE $${totalUsd.toLocaleString()} USD:`);
  console.log(`   - Salida obtenida: $${Math.floor(singleOut).toLocaleString()} USD`);
  console.log(`   - Pérdida por Slippage: ${singleSlippage.toFixed(2)}% (-$${Math.floor(totalUsd - singleOut).toLocaleString()})`);

  console.log(`\n2. DIVIDIDO EN ${chunksCount} CHUNKS DE $${chunkUsd.toLocaleString()} USD (Cobrado como 1 sola operación):`);
  console.log(`   - Salida obtenida: $${Math.floor(totalChunkOut).toLocaleString()} USD`);
  console.log(`   - Pérdida por Slippage: ${chunkSlippage.toFixed(2)}% (-$${Math.floor(totalUsd - totalChunkOut).toLocaleString()})`);

  const extraSaved = totalChunkOut - singleOut;
  console.log(`\n💡 BENEFICIO NETO AL DIVIDIRLO:`);
  console.log(`   - Dinero EXTRA rescatado en el bolsillo del usuario: +$${Math.floor(extraSaved).toLocaleString()} USD`);
  console.log(`   - Fee total FlashShift (0.25% cobrado como 1): $${(totalUsd * 0.0025).toLocaleString()} USD`);
}

async function run() {
  // Test 1: $1,000,000 USDe -> USDC dividido en 5 chunks de $200k
  await benchmarkSingleVsChunks("USDe", "USDC", 1000000, 5);

  // Test 2: $2,500,000 cbETH -> WETH dividido en 5 chunks de $500k
  // (cbETH tiene precio ~2420)
  console.log(`\n================================================================`);
  console.log(`  TEST CBETH -> WETH MULTI-HOP`);
  console.log(`================================================================`);
  const rawCbEthTotal = (1000n * 10n ** 18n).toString(); // ~1000 cbETH = $2.4M
  const singleCbEth = await getQuote(BASE_TOKENS.cbETH, BASE_TOKENS.WETH, rawCbEthTotal);
  console.log(`Single 1000 cbETH Out USD: $${Math.floor(Number(singleCbEth?.amountOutUsd || 0)).toLocaleString()}`);

  const rawCbEthChunk = (200n * 10n ** 18n).toString(); // 5 chunks de 200 cbETH
  const chunkCbEth = await getQuote(BASE_TOKENS.cbETH, BASE_TOKENS.WETH, rawCbEthChunk);
  const totalChunkCbEth = Number(chunkCbEth?.amountOutUsd || 0) * 5;
  console.log(`5 Chunks de 200 cbETH Out USD: $${Math.floor(totalChunkCbEth).toLocaleString()}`);
  console.log(`Diferencia rescatada: +$${Math.floor(totalChunkCbEth - Number(singleCbEth?.amountOutUsd || 0)).toLocaleString()} USD`);
}

run();
