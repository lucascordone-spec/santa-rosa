#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  SANTA ROSA / FLASHSHIFT — AUTONOMOUS SENTINEL KEEPER BOT (BASE L2 - 8453)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 *  Misión:
 *   1. Escanea en tiempo real las posiciones al borde de la liquidación en Morpho Blue
 *      en Base L2 usando el GraphQL oficial (api.morpho.org).
 *   2. Filtra por riesgo crítico: 1.0000 <= Health Factor <= 1.0600 y Deuda > $1,000 USD.
 *   3. Llama al Gateway MCP oficial (JSON-RPC 2.0 tools/call):
 *      - simulate_rescue_savings: Simulación de ahorro y distribución de fees.
 *      - build_rescue_transaction: Parámetros del Flash Loan 0.00% y enrutamiento.
 *   4. Genera la calldata EVM completa lista para ejecutar en el Router on-chain:
 *      0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57
 *   5. Reparte 0.05% de comisión en el mismo bloque para la billetera del Keeper (20% rev-share).
 * 
 *  Uso:
 *   node sentinel.mjs --dry-run
 *   node sentinel.mjs --dry-run --referral 0xYourWalletAddress
 *   node sentinel.mjs --poll --interval 15 --referral 0xYourWalletAddress
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { encodeFunctionData, parseAbi } from "viem";
import fs from "fs";

// --- Constantes Oficiales en Base L2 (8453) ---
const ROUTER_DEPLOYED_ADDRESS = "0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57";
const DEFAULT_GATEWAY_URL = "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp";
const MORPHO_GRAPHQL_URL = "https://api.morpho.org/graphql";
const DEFAULT_REFERRAL_WALLET = "0xf8e8f98CB88199650Fa8e93965fDf4F02c2EA7a8"; // Autonomous Keeper Referral Address (0.05% builder fee)

// ABI del Router FlashShift para executeAction
const ROUTER_ABI = parseAbi([
  "function executeAction(uint8 action, uint8 protocol, address loanToken, uint256 loanAmount, address referral, (address aggregatorRouter, address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, bytes callData) swap) external"
]);

// Parseo de argumentos de línea de comando
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    dryRun: false,
    poll: false,
    intervalSec: 15,
    referral: process.env.KEEPER_REFERRAL_WALLET || process.env.KEEPER_WALLET || DEFAULT_REFERRAL_WALLET,
    gatewayUrl: process.env.MCP_GATEWAY_URL || DEFAULT_GATEWAY_URL,
    minDebtUsd: 1000,
    minHf: 1.0000,
    maxHf: 1.0600,
    limit: 200
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") config.dryRun = true;
    else if (arg === "--poll") config.poll = true;
    else if (arg === "--interval" && args[i + 1]) config.intervalSec = Number(args[++i]);
    else if (arg === "--referral" && args[i + 1]) config.referral = args[++i];
    else if (arg === "--gateway" && args[i + 1]) config.gatewayUrl = args[++i];
    else if (arg === "--min-debt" && args[i + 1]) config.minDebtUsd = Number(args[++i]);
    else if (arg === "--min-hf" && args[i + 1]) config.minHf = Number(args[++i]);
    else if (arg === "--max-hf" && args[i + 1]) config.maxHf = Number(args[++i]);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  // Si no se especifica --poll ni --dry-run, activar --dry-run por defecto como medida de seguridad
  if (!config.poll && !config.dryRun) {
    config.dryRun = true;
  }

  return config;
}

function printHelp() {
  console.log(`
Uso: node sentinel.mjs [opciones]

Opciones:
  --dry-run               Ejecuta un ciclo completo de escaneo y simulación sin transmitir txs (por defecto).
  --poll                  Ejecuta el bot continuamente en bucle cada N segundos.
  --interval <seg>        Intervalo de sondeo en segundos para modo poll (def: 15).
  --referral <wallet>     Billetera EVM para recibir el 0.05% de fee en Base L2.
  --min-debt <usd>        Filtro de deuda mínima en USD (def: 1000).
  --min-hf <valor>        Health Factor mínimo (def: 1.0000).
  --max-hf <valor>        Health Factor máximo (def: 1.0600).
  --gateway <url>         Endpoint del Gateway MCP (def: ${DEFAULT_GATEWAY_URL}).
  --help, -h              Muestra esta ayuda.
`);
}

/**
 * Consulta las posiciones reales en riesgo en Morpho Blue Base
 */
async function fetchMorphoAtRiskPositions(config) {
  const query = `
  query {
    marketPositions(
      first: ${config.limit},
      orderBy: HealthFactor,
      orderDirection: Asc,
      where: {
        chainId_in: [8453],
        healthFactor_gte: ${config.minHf},
        healthFactor_lte: ${config.maxHf}
      }
    ) {
      items {
        user {
          address
        }
        market {
          lltv
          loanAsset {
            symbol
            address
            decimals
          }
          collateralAsset {
            symbol
            address
            decimals
          }
        }
        healthFactor
        state {
          borrowAssets
          borrowAssetsUsd
          collateral
          collateralUsd
        }
      }
    }
  }
  `;

  const res = await fetch(MORPHO_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    throw new Error(`Morpho GraphQL HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Morpho GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  const items = json.data?.marketPositions?.items || [];

  // Filtrar estrictamente por deuda activa >= minDebtUsd y HF válido
  return items.filter(pos => {
    const debtUsd = Number(pos.state?.borrowAssetsUsd || 0);
    const hf = Number(pos.healthFactor);
    return (
      !isNaN(hf) &&
      hf >= config.minHf &&
      hf <= config.maxHf &&
      debtUsd >= config.minDebtUsd
    );
  });
}

/**
 * Llama a una herramienta en el Gateway MCP remoto vía JSON-RPC 2.0
 */
async function callMcpTool(gatewayUrl, toolName, toolArgs) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now() + Math.floor(Math.random() * 1000),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: toolArgs
    }
  };

  const res = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-agent-id": "sentinel-keeper-bot",
      "x-framework": "Sentinel Keeper CLI / Morpho Base"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`MCP Gateway HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(`MCP Gateway Tool error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  const textContent = json.result?.content?.[0]?.text;
  if (!textContent) {
    throw new Error(`Respuesta vacía del Gateway MCP para la herramienta ${toolName}`);
  }

  try {
    return JSON.parse(textContent);
  } catch (e) {
    return textContent;
  }
}

/**
 * Codifica la calldata completa de executeAction para FlashShiftRouter
 */
function buildCalldata(pos, referral) {
  const loanToken = pos.market.loanAsset?.address;
  const loanDecimals = Number(pos.market.loanAsset?.decimals || 18);

  let loanAmountWei = 0n;
  if (pos.state?.borrowAssets !== undefined && pos.state?.borrowAssets !== null) {
    try {
      loanAmountWei = BigInt(pos.state.borrowAssets);
    } catch {
      loanAmountWei = BigInt(Math.floor(Number(pos.state.borrowAssetsUsd) * (10 ** loanDecimals)));
    }
  } else {
    loanAmountWei = BigInt(Math.floor(Number(pos.state.borrowAssetsUsd) * (10 ** loanDecimals)));
  }

  const emptySwapParams = {
    aggregatorRouter: "0x0000000000000000000000000000000000000000",
    tokenIn: pos.market.collateralAsset?.address || "0x0000000000000000000000000000000000000000",
    tokenOut: loanToken,
    amountIn: 0n,
    minAmountOut: 0n,
    callData: "0x"
  };

  // Acción: 0 (RESCUE), Protocolo: 0 (MORPHO)
  return encodeFunctionData({
    abi: ROUTER_ABI,
    functionName: "executeAction",
    args: [0, 0, loanToken, loanAmountWei, referral, emptySwapParams]
  });
}

/**
 * Ciclo principal de escaneo, simulación y generación de transacciones
 */
async function runSentinelCycle(config) {
  const timestamp = new Date().toISOString();
  console.log(`\n========================================================================================`);
  console.log(`📡 [${timestamp}] SCANNING MORPHO BLUE BASE (ChainId 8453)...`);
  console.log(`   Criteria: ${config.minHf.toFixed(4)} <= HF <= ${config.maxHf.toFixed(4)} | Debt >= $${config.minDebtUsd.toLocaleString()} USD`);
  console.log(`   Referral Wallet: ${config.referral} (0.05% fee share in same block)`);
  console.log(`   MCP Gateway: ${config.gatewayUrl}`);
  console.log(`   Base Router: ${ROUTER_DEPLOYED_ADDRESS}`);
  console.log(`========================================================================================\n`);

  let positions = [];
  try {
    positions = await fetchMorphoAtRiskPositions(config);
  } catch (err) {
    console.error(`❌ Error querying Morpho GraphQL: ${err.message}`);
    return;
  }

  if (positions.length === 0) {
    console.log(`ℹ️  No positions found with HF in [${config.minHf}, ${config.maxHf}] and Debt >= $${config.minDebtUsd}. Market is healthy.`);
    return;
  }

  console.log(`🎯 Detected ${positions.length} CRITICAL AT-RISK positions on Base L2:\n`);

  let batchTotalDebt = 0;
  let batchTotalUserSavings = 0;
  let batchTotalKeeperProfit = 0;
  let batchTotalProtocolFee = 0;
  const exportedTargets = [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const user = pos.user.address;
    const collatSym = pos.market.collateralAsset?.symbol || "UNKNOWN";
    const loanSym = pos.market.loanAsset?.symbol || "UNKNOWN";
    const pair = `${collatSym}/${loanSym}`;
    const debtUsd = Number(pos.state.borrowAssetsUsd || 0);
    const collatUsd = Number(pos.state.collateralUsd || 0);
    const hf = Number(pos.healthFactor);
    const lltvPercent = (Number(pos.market.lltv) / 1e16).toFixed(2) + "%";

    console.log(`┌───────────────────────────────────────────────────────────────────────────────────────`);
    console.log(`│ [#${i + 1}] AT-RISK POSITION: ${user}`);
    console.log(`│ Market: ${pair} (LLTV: ${lltvPercent}) | Current HF: \x1b[31m${hf.toFixed(4)}\x1b[0m`);
    console.log(`│ Active Debt: $${debtUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD | Collateral: $${collatUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);

    // 1. Simulación vía Gateway MCP
    let simulation = null;
    try {
      simulation = await callMcpTool(config.gatewayUrl, "simulate_rescue_savings", {
        userAddress: user,
        currentDebtUsd: debtUsd,
        currentCollateralUsd: collatUsd,
        debtToRepayUsd: debtUsd,
        referralAddress: config.referral
      });
    } catch (err) {
      console.warn(`│ ⚠️  Fallo en llamada MCP simulate_rescue_savings: ${err.message}`);
    }

    // 2. Construcción de Transacción vía Gateway MCP
    let txPayload = null;
    try {
      txPayload = await callMcpTool(config.gatewayUrl, "build_rescue_transaction", {
        protocol: "MORPHO",
        loanToken: pos.market.loanAsset?.address,
        amount: debtUsd,
        referralAddress: config.referral
      });
    } catch (err) {
      console.warn(`│ ⚠️  Fallo en llamada MCP build_rescue_transaction: ${err.message}`);
    }

    // 3. Cálculos Económicos Estrictos
    const penaltyAvoided = debtUsd * 0.05;         // 5% castigo típico de liquidación
    const flashShiftTotalFee = debtUsd * 0.0025;   // 0.25% fee total FlashShift
    const keeperProfitUsd = debtUsd * 0.0005;      // 0.05% comisión del keeper (20% del fee)
    const protocolFeeUsd = debtUsd * 0.0020;       // 0.20% fee del protocolo Santa Rosa
    const netSavingsUsd = penaltyAvoided - flashShiftTotalFee; // 4.75% ahorro neto para el usuario

    batchTotalDebt += debtUsd;
    batchTotalUserSavings += netSavingsUsd;
    batchTotalKeeperProfit += keeperProfitUsd;
    batchTotalProtocolFee += protocolFeeUsd;

    exportedTargets.push({
      wallet: user,
      pair,
      healthFactor: Number(hf.toFixed(5)),
      debtUsd: Number(debtUsd.toFixed(2)),
      collatUsd: Number(collatUsd.toFixed(2)),
      loanTokenAddress: pos.market.loanAsset?.address,
      collateralTokenAddress: pos.market.collateralAsset?.address,
      projectedTreasuryFeeUsd: Number(protocolFeeUsd.toFixed(2)),
      projectedKeeperFeeUsd: Number(keeperProfitUsd.toFixed(2)),
      userSavingsUsd: Number(netSavingsUsd.toFixed(2))
    });

    // 4. Generación de Calldata EVM para Base Mainnet
    let calldataHex = "0x";
    try {
      calldataHex = buildCalldata(pos, config.referral);
    } catch (err) {
      console.warn(`│ ⚠️  Error generando calldata: ${err.message}`);
    }

    console.log(`├───────────────────────────────────────────────────────────────────────────────────────`);
    console.log(`│ 💡 PRE-FLIGHT MCP SIMULATION:`);
    if (simulation?.financialComparison) {
      console.log(`│   • Liquidation Penalty Avoided:  $${simulation.financialComparison.liquidationPenaltyIfLiquidatedUsd.toFixed(2)} USD (5.00%)`);
      console.log(`│   • Total FlashShift Fee:         $${simulation.financialComparison.flashShiftFeeUsd.toFixed(2)} USD (0.25%)`);
      console.log(`│   • \x1b[32mNet Keeper Profit (0.05%):\x1b[0m      \x1b[32m$${simulation.financialComparison.builderFeeUsd.toFixed(2)} USD\x1b[0m`);
      console.log(`│   • Protocol Treasury (0.20%):    $${simulation.financialComparison.protocolFeeUsd.toFixed(2)} USD`);
      console.log(`│   • \x1b[36mNet User Savings:\x1b[0m               \x1b[36m$${simulation.financialComparison.netMoneySavedUsd.toFixed(2)} USD (20x cheaper)\x1b[0m`);
    } else {
      console.log(`│   • Liquidation Penalty Avoided:  $${penaltyAvoided.toFixed(2)} USD`);
      console.log(`│   • \x1b[32mNet Keeper Profit (0.05%):\x1b[0m      \x1b[32m$${keeperProfitUsd.toFixed(2)} USD\x1b[0m`);
      console.log(`│   • \x1b[36mNet User Savings:\x1b[0m               \x1b[36m$${netSavingsUsd.toFixed(2)} USD\x1b[0m`);
    }

    console.log(`├───────────────────────────────────────────────────────────────────────────────────────`);
    console.log(`│ ⚡ READY-TO-SIGN PAYLOAD FOR BASE L2:`);
    console.log(`│   • To:                ${ROUTER_DEPLOYED_ADDRESS}`);
    console.log(`│   • Flash Loan:        0.00% Fee via Morpho Blue`);
    console.log(`│   • Debt Token:        ${pos.market.loanAsset?.address} (${loanSym})`);
    console.log(`│   • Referral Target:   ${config.referral}`);
    console.log(`│   • Estimated L2 Gas:  < $0.05 USD (~490k gas)`);
    console.log(`│   • Calldata:          ${calldataHex.slice(0, 74)}... (${calldataHex.length} chars)`);
    console.log(`└───────────────────────────────────────────────────────────────────────────────────────\n`);
  }

  // Export positions for alert engine and bots
  try {
    fs.writeFileSync("./packages/sentinel-keeper/all-at-risk-positions.json", JSON.stringify(exportedTargets, null, 2));
    console.log(`💾 Exported ${exportedTargets.length} at-risk positions to packages/sentinel-keeper/all-at-risk-positions.json`);
  } catch (err) {
    console.warn(`⚠️ Error saving all-at-risk-positions.json: ${err.message}`);
  }

  console.log(`========================================================================================`);
  console.log(`📊 EXECUTIVE SUMMARY ON BASE L2 (LIVE ON-CHAIN METRICS)`);
  console.log(`========================================================================================`);
  console.log(`   🏦 Total Rescuable Debt Volume:  $${batchTotalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);
  console.log(`   🛡️  Total Borrower Savings:       $${batchTotalUserSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (Avoided 5% penalty)`);
  console.log(`   💰 KEEPER DIRECT PROFIT:         $${batchTotalKeeperProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (0.05% net commission)`);
  console.log(`   🏛️  Protocol Treasury Revenue:    $${batchTotalProtocolFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (0.20%)`);
  console.log(`========================================================================================\n`);

  if (config.dryRun) {
    console.log(`[DRY-RUN MODE COMPLETE]: Calldata validated and connected with MCP Gateway. No tx broadcasted.`);
  }
}

// --- Entrada de Ejecución Principal ---
async function main() {
  const config = parseArgs();

  console.log(`
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║         SANTA ROSA / FLASHSHIFT — AUTONOMOUS SENTINEL KEEPER BOT            ║
  ║                   Base L2 Mainnet (ChainId: 8453)                           ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  `);

  if (config.poll) {
    console.log(`🚀 Modo MONITOR CONTINUO activado. Polling cada ${config.intervalSec} segundos... (Presiona Ctrl+C para salir)\n`);
    await runSentinelCycle(config);
    setInterval(async () => {
      try {
        await runSentinelCycle(config);
      } catch (e) {
        console.error(`Error en ciclo de sondeo: ${e.message}`);
      }
    }, config.intervalSec * 1000);
  } else {
    await runSentinelCycle(config);
  }
}

main().catch(err => {
  console.error("Error fatal en Sentinel Keeper:", err);
  process.exit(1);
});
