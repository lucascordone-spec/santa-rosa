const fetch = globalThis.fetch || require("node-fetch");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";

// Lista exhaustiva de AMMs en Base para EXCLUIR
const AMM_SOURCES_TO_EXCLUDE = [
  "uniswapv3",
  "uniswap-v4",
  "uniswap-v4-fairflow",
  "aero-cl",
  "aerodrome",
  "aerodrome-cl",
  "curve",
  "pancake-v3",
  "alien-base",
  "alien-base-cl",
  "maverick-v2",
  "quickswap-v4",
  "sushiswap-v3",
  "baseswap",
  "balancer"
].join(",");

async function testExcludingAMMs(tokenIn, tokenOut, amountUsd, unitPriceIn) {
  const unitsIn = amountUsd / unitPriceIn;
  const rawAmountIn = BigInt(Math.floor(unitsIn * 1e18)).toString();

  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}&excludedSources=${AMM_SOURCES_TO_EXCLUDE}&saveGas=0`;

  console.log(`\n================================================================`);
  console.log(`CONSULTA KYBER EXCLUYENDO TODOS LOS AMMs: $${amountUsd.toLocaleString()} USD`);
  console.log(`================================================================`);

  try {
    const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
    const data = await res.json();

    if (!data.data || !data.data.routeSummary) {
      console.log("Respuesta de Kyber:", JSON.stringify(data));
      return;
    }

    const summary = data.data.routeSummary;
    const amountInUsd = Number(summary.amountInUsd);
    const amountOutUsd = Number(summary.amountOutUsd);
    const slippage = ((amountInUsd - amountOutUsd) / amountInUsd) * 100;

    console.log(`- AmountIn USD:  $${amountInUsd.toLocaleString()}`);
    console.log(`- AmountOut USD: $${amountOutUsd.toLocaleString()}`);
    console.log(`- Slippage Real: ${slippage.toFixed(2)}%`);

    console.log(`- Fuentes Restantes Utilizadas (PMMs):`);
    if (summary.route) {
      for (const subRoute of summary.route) {
        for (const step of subRoute) {
          console.log(`  * Exchange: ${step.exchange.padEnd(25)} | Pool: ${step.pool}`);
        }
      }
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

async function run() {
  await testExcludingAMMs(WETH, USDC, 500000, 2223.0);
  await testExcludingAMMs(WETH, USDC, 1000000, 2223.0);
  await testExcludingAMMs(USDe, USDC, 250000, 1.0);
}

run();
