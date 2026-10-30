const fetch = globalThis.fetch || require("node-fetch");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";

// Lista de PMMs conocidos integrados en KyberSwap
const PMM_SOURCES = [
  "bebop",
  "pmm-13",
  "pmm-19",
  "pmm-20",
  "dodo-dpp",
  "woofi-v3",
  "manta-prop",
  "prism-prop",
  "tidefi-prop",
  "metric-propamm"
].join(",");

async function testOnlyPMMs(tokenIn, tokenOut, amountUsd, unitPriceIn) {
  const unitsIn = amountUsd / unitPriceIn;
  const rawAmountIn = BigInt(Math.floor(unitsIn * 1e18)).toString();

  // Llamada a Kyber usando ÚNICAMENTE fuentes PMM (eliminando todos los AMMs)
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${rawAmountIn}&includedSources=${PMM_SOURCES}&saveGas=0`;

  console.log(`\n================================================================`);
  console.log(`CONSULTA KYBER CON SOLO PMMs (CERO AMMs): $${amountUsd.toLocaleString()} USD`);
  console.log(`URL: ${url}`);
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

    console.log(`- Fuentes de Ejecución Utilizadas:`);
    if (summary.route) {
      for (const subRoute of summary.route) {
        for (const step of subRoute) {
          console.log(`  * Exchange: ${step.exchange} | Pool: ${step.pool}`);
        }
      }
    }
  } catch (err) {
    console.log("Error consultando Kyber:", err.message);
  }
}

async function run() {
  // Probamos $500k y $1M en WETH -> USDC con CERO AMMs
  await testOnlyPMMs(WETH, USDC, 500000, 2223.0);
  await testOnlyPMMs(WETH, USDC, 1000000, 2223.0);

  // Probamos USDe -> USDC con CERO AMMs
  await testOnlyPMMs(USDe, USDC, 250000, 1.0);
}

run();
