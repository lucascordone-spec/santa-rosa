const fetch = globalThis.fetch || require("node-fetch");

const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function getRealKyberCalldata(amountUsd, recipient) {
  const rawAmountIn = (BigInt(amountUsd) * 10n ** 18n).toString();
  
  // 1. Get Route
  const routeUrl = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${USDC}&amountIn=${rawAmountIn}`;
  const routeRes = await fetch(routeUrl, { headers: { "x-client-id": "flashshift" } });
  const routeData = await routeRes.json();
  const routeSummary = routeData.data?.routeSummary;

  if (!routeSummary) {
    console.log(`Failed to get route for $${amountUsd}`);
    return null;
  }

  // 2. Build Calldata
  const buildUrl = `https://aggregator-api.kyberswap.com/base/api/v1/route/build`;
  const buildRes = await fetch(buildUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-client-id": "flashshift" },
    body: JSON.stringify({
      routeSummary: routeSummary,
      sender: recipient,
      recipient: recipient,
      slippageTolerance: 50 // 0.5%
    })
  });

  const buildData = await buildRes.json();
  return {
    amountInUsd: routeSummary.amountInUsd,
    amountOutUsd: routeSummary.amountOutUsd,
    expectedOutRaw: routeSummary.amountOut,
    routerAddress: buildData.data?.routerAddress,
    callData: buildData.data?.data
  };
}

async function run() {
  console.log("Obteniendo calldata real de Kyber para pruebas on-chain...");
  const q1 = await getRealKyberCalldata(100000, "0x7bee8D37FBA61a6251a08b957d502C56E2A50FAb");
  console.log("Monto: $100k");
  console.log("Router:", q1?.routerAddress);
  console.log("Expected Out Raw:", q1?.expectedOutRaw);
  console.log("Calldata length:", q1?.callData?.length);
  
  const q2 = await getRealKyberCalldata(250000, "0x7bee8D37FBA61a6251a08b957d502C56E2A50FAb");
  console.log("\nMonto: $250k");
  console.log("Expected Out Raw:", q2?.expectedOutRaw);
  console.log("Calldata length:", q2?.callData?.length);
}

run();
