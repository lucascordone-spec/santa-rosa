const fetch = globalThis.fetch || require("node-fetch");

const BASE_TOKENS = {
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    unitPriceUsd: 2223.0
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    unitPriceUsd: 1.0
  },
  USDe: {
    address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
    decimals: 18,
    unitPriceUsd: 1.0
  },
  cbETH: {
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    unitPriceUsd: 2420.0
  }
};

async function checkSlippage(tokenInSymbol, tokenOutSymbol, usdAmounts) {
  const tIn = BASE_TOKENS[tokenInSymbol];
  const tOut = BASE_TOKENS[tokenOutSymbol];

  console.log(`\n======================================================`);
  console.log(`  BENCHMARK KYBERSWAP BASE L2: ${tokenInSymbol} -> ${tokenOutSymbol}`);
  console.log(`======================================================`);

  for (const amountUsd of usdAmounts) {
    const unitsIn = amountUsd / tIn.unitPriceUsd;
    const rawAmountIn = BigInt(Math.floor(unitsIn * 10 ** tIn.decimals)).toString();

    const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tIn.address}&tokenOut=${tOut.address}&amountIn=${rawAmountIn}`;

    try {
      const res = await fetch(url, { headers: { "x-client-id": "flashshift-research" } });
      const data = await res.json();

      if (!data.data || !data.data.routeSummary) {
        console.log(`- $${amountUsd.toLocaleString()} USD: Error or insufficient liquidity`);
        continue;
      }

      const summary = data.data.routeSummary;
      const amountInUsd = Number(summary.amountInUsd);
      const amountOutUsd = Number(summary.amountOutUsd);
      const slippagePercent = ((amountInUsd - amountOutUsd) / amountInUsd) * 100;

      // Extract unique DEXes used in multihop
      const dexes = new Set();
      if (summary.route) {
        for (const subRoute of summary.route) {
          for (const step of subRoute) {
            if (step.exchange) dexes.add(step.exchange);
          }
        }
      }

      console.log(
        `- $${amountUsd.toLocaleString().padEnd(10)} USD | Out: $${Math.floor(amountOutUsd).toLocaleString().padEnd(10)} | Slippage / Impact: ${slippagePercent.toFixed(2)}% | DEXes: ${Array.from(dexes).join(", ")}`
      );
    } catch (err) {
      console.log(`- $${amountUsd.toLocaleString()} USD: Network Exception: ${err.message}`);
    }
  }
}

async function run() {
  const testAmounts = [10000, 50000, 250000, 1000000, 2500000, 5000000];

  await checkSlippage("WETH", "USDC", testAmounts);
  await checkSlippage("USDe", "USDC", testAmounts);
  await checkSlippage("cbETH", "WETH", [10000, 50000, 250000, 1000000, 2500000]);
}

run();
