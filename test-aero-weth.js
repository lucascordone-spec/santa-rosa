const fetch = globalThis.fetch || require("node-fetch");

const AERO = "0x940181a94A35A4569E4529A3CDfB74e48FD98AE3";
const WETH = "0x4200000000000000000000000000000000000006";

async function testAeroWeth() {
  console.log("Probando par nativo de Base: AERO -> WETH...");
  for (const amt of [50000, 100000, 250000, 500000]) {
    const rawIn = BigInt(Math.floor((amt / 0.95) * 1e18)).toString();
    const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${AERO}&tokenOut=${WETH}&amountIn=${rawIn}&saveGas=0`;
    const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
    const data = await res.json();
    const summary = data.data?.routeSummary;
    if (summary) {
      const inUsd = Number(summary.amountInUsd);
      const outUsd = Number(summary.amountOutUsd);
      const slippage = ((inUsd - outUsd) / inUsd) * 100;
      console.log(`- $${amt.toLocaleString().padEnd(8)} USD | Out: $${Math.floor(outUsd).toLocaleString().padEnd(8)} | Slippage: ${slippage.toFixed(2)}% | Gas: $${Number(summary.gasUsd).toFixed(4)} | DEX: ${summary.route[0][0].exchange}`);
    }
  }
}

testAeroWeth();
