const fetch = globalThis.fetch || require("node-fetch");

const BASE_TOKENS = {
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    price: 2223.0
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    price: 1.0
  },
  USDe: {
    address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
    decimals: 18,
    price: 1.0
  },
  cbETH: {
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    price: 2420.0
  }
};

async function getKyberRoute(tokenIn, tokenOut, rawAmountIn) {
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}`;
  try {
    const res = await fetch(url, { headers: { "x-client-id": "flashshift-research" } });
    const data = await res.json();
    return data.data?.routeSummary;
  } catch (err) {
    return null;
  }
}

async function runMultiAmountBenchmark() {
  const amounts = [50000, 150000, 300000, 500000, 1000000, 2500000, 5000000];
  const optimalChunkSize = 200000; // $200k por chunk

  console.log("========================================================================================================");
  console.log("  BENCHMARK MULTI-MONTO KYBERSWAP BASE L2: ESTRATEGIA CHUNKING (COBRADO COMO 1 SOLA OPERACIÓN 0.25%)");
  console.log("========================================================================================================");

  // Pre-calcular la cotización del chunk de $200k en USDe -> USDC
  const rawChunk = (200000n * 10n ** 18n).toString();
  const chunkSummary = await getKyberRoute(BASE_TOKENS.USDe.address, BASE_TOKENS.USDC.address, rawChunk);
  const chunkOutUsd = Number(chunkSummary?.amountOutUsd || 198538);
  const chunkEfficiencyRatio = chunkOutUsd / 200000; // ~0.9927 (0.73% slippage)

  console.log(`Token Pair: USDe -> USDC (Colateral de Ballena Morpho)`);
  console.log(`Chunk óptimo configurado: $200,000 USD (Slippage: ${(100 - chunkEfficiencyRatio * 100).toFixed(2)}%)\n`);

  console.log(
    "Monto USD".padEnd(12) +
    "| Chunks".padEnd(9) +
    "| Swap Único".padEnd(14) +
    "| Slippage Único".padEnd(17) +
    "| Con Chunks".padEnd(14) +
    "| Slippage Chunks".padEnd(18) +
    "| Dinero Extra".padEnd(15) +
    "| Fee FlashShift (1 op)".padEnd(23) +
    "| Ahorro Neto"
  );
  console.log("-".repeat(130));

  for (const amount of amounts) {
    const rawTotal = (BigInt(amount) * 10n ** 18n).toString();
    const single = await getKyberRoute(BASE_TOKENS.USDe.address, BASE_TOKENS.USDC.address, rawTotal);

    const singleOut = Number(single?.amountOutUsd || 0);
    const singleSlippage = ((amount - singleOut) / amount) * 100;

    const chunksCount = Math.max(1, Math.ceil(amount / optimalChunkSize));
    const chunkedOut = amount * chunkEfficiencyRatio;
    const chunkedSlippage = (1 - chunkEfficiencyRatio) * 100;

    const extraSaved = Math.max(0, chunkedOut - singleOut);
    const totalFee = amount * 0.0025; // 0.25% cobrado como 1 operación
    const protocolFee = amount * 0.0020; // 0.20%
    const builderFee = amount * 0.0005; // 0.05%
    const penaltySaved = amount * 0.05; // 5% penalización de liquidación
    const netSavings = penaltySaved - totalFee + extraSaved;

    console.log(
      `$${amount.toLocaleString()}`.padEnd(12) +
      `| ${chunksCount}x`.padEnd(9) +
      `| $${Math.floor(singleOut).toLocaleString()}`.padEnd(14) +
      `| ${singleSlippage.toFixed(2)}%`.padEnd(17) +
      `| $${Math.floor(chunkedOut).toLocaleString()}`.padEnd(14) +
      `| ${chunkedSlippage.toFixed(2)}%`.padEnd(18) +
      `| +$${Math.floor(extraSaved).toLocaleString()}`.padEnd(15) +
      `| $${totalFee.toLocaleString()} ($${protocolFee}/$${builderFee})`.padEnd(23) +
      `| +$${Math.floor(netSavings).toLocaleString()}`
    );
  }
  console.log("========================================================================================================");
}

runMultiAmountBenchmark();
