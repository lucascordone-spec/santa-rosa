const fetch = globalThis.fetch || require("node-fetch");

const TOKENS_BASE = {
  USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, price: 1.0 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18, price: 2223.0 },
  cbBTC: { address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", decimals: 8, price: 68500.0 },
  wstETH: { address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452", decimals: 18, price: 2650.0 },
  cbETH: { address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", decimals: 18, price: 2420.0 },
  AERO: { address: "0x940181a94A35A4569E4529A3CDfB74e48FD98AE3", decimals: 18, price: 0.95 }
};

async function testTokenLiquidity(tokenInName, tokenOutName, amountsUsd) {
  const tIn = TOKENS_BASE[tokenInName];
  const tOut = TOKENS_BASE[tokenOutName];

  console.log(`\n========================================================================================`);
  console.log(`  PROBANDO LIQUIDEZ Y SLIPPAGE EN BASE: ${tokenInName} -> ${tokenOutName}`);
  console.log(`========================================================================================`);

  for (const amt of amountsUsd) {
    const units = amt / tIn.price;
    const rawIn = BigInt(Math.floor(units * 10 ** tIn.decimals)).toString();

    const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tIn.address}&tokenOut=${tOut.address}&amountIn=${rawIn}&saveGas=0`;

    try {
      const res = await fetch(url, { headers: { "x-client-id": "flashshift" } });
      const data = await res.json();
      const summary = data.data?.routeSummary;

      if (!summary) {
        console.log(`- $${amt.toLocaleString().padEnd(10)} USD: Sin ruta disponible`);
        continue;
      }

      const inUsd = Number(summary.amountInUsd);
      const outUsd = Number(summary.amountOutUsd);
      const slippage = ((inUsd - outUsd) / inUsd) * 100;
      const gasCost = Number(summary.gasUsd).toFixed(4);

      // Extraer exchanges y splits
      const splitsCount = summary.route ? summary.route.length : 1;
      const exchanges = new Set();
      if (summary.route) {
        for (const sub of summary.route) {
          for (const s of sub) exchanges.add(s.exchange);
        }
      }

      console.log(
        `- $${amt.toLocaleString().padEnd(10)} USD | Out: $${Math.floor(outUsd).toLocaleString().padEnd(10)} | Slippage: ${slippage.toFixed(2)}% | Gas: $${gasCost} | Splits: ${splitsCount} | Exchanges: ${Array.from(exchanges).slice(0, 5).join(", ")}`
      );
    } catch (err) {
      console.log(`- $${amt.toLocaleString().padEnd(10)} USD: Error de conexión`);
    }
  }
}

async function run() {
  // 1. cbBTC (Bitcoin oficial de Coinbase en Base - Más de $1B de colateral en Morpho/Aave)
  await testTokenLiquidity("cbBTC", "USDC", [100000, 500000, 1000000, 2500000]);

  // 2. wstETH (Lido Staked ETH - Colateral rey en Morpho y Aave)
  await testTokenLiquidity("wstETH", "USDC", [100000, 500000, 1000000, 2500000]);

  // 3. wstETH -> WETH (El swap natural de desapalancamiento LST/ETH)
  await testTokenLiquidity("wstETH", "WETH", [100000, 500000, 1000000, 2500000, 5000000]);

  // 4. AERO (Token del ecosistema más grande de Base)
  await testTokenLiquidity("AERO", "USDC", [50000, 100000, 250000, 500000]);
}

run();
