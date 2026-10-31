#!/usr/bin/env node
/**
 * @file cli.ts
 * @notice Interfaz CLI interactiva y automatizada para prospección B2B de Santa Rosa / FlashShift en Base L2.
 * Permite seleccionar un curador o DAO, ingresar volumen objetivo, consultar el Gateway MCP en vivo,
 * calcular el Builder Revenue Share (80/20) y redactar propuestas listas para enviar.
 */

import * as readline from "node:readline";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  getAllCurators,
  getCuratorById,
  CuratorProfile,
  CURATORS_DIRECTORY,
} from "./curators.js";
import {
  calculatePartnershipProjection,
  quoteRescueLive,
  DEFAULT_MCP_GATEWAY_URL,
} from "./calculator.js";
import {
  generateAllPitches,
  generateGovernanceProposal,
  generateDiscordPitch,
  generateTelegramPitch,
} from "./pitch.js";

function parseHumanNumber(input: string): number {
  const clean = input.trim().toUpperCase().replace(/[$,]/g, "");
  if (clean.endsWith("M")) {
    return parseFloat(clean.slice(0, -1)) * 1_000_000;
  }
  if (clean.endsWith("K")) {
    return parseFloat(clean.slice(0, -1)) * 1_000;
  }
  if (clean.endsWith("B")) {
    return parseFloat(clean.slice(0, -1)) * 1_000_000_000;
  }
  return parseFloat(clean);
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function promptAsync(rl: readline.Interface, questionText: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => resolve(answer.trim()));
  });
}

function printBanner() {
  console.log(`
================================================================================
   SANTA ROSA / FLASHSHIFT - B2B PARTNERSHIP & ACQUISITION AGENT
   Base L2 Institutional Outreach | 20% Builder Revenue Share Engine
================================================================================
  `);
}

function printUsage() {
  console.log(`
Uso de la CLI:
  npm run pitch
  node dist/cli.js [opciones]

Opciones:
  --curator <id>      ID del curador (steakhouse, re7, gauntlet, aerodrome, bware, bprotocol)
  --volume <numero>   Volumen mensual en USD (ej. 50000000 o 50M)
  --wallet <address>  Billetera de referido (0x...) para recibir 5 bps on-chain
  --format <tipo>     Formato de salida: forum | discord | telegram | all (default: all)
  --output <dir>      Directorio donde guardar las propuestas generadas (opcional)
  --list              Lista los curadores institucionales registrados y sale
  --help              Muestra esta ayuda
`);
}

async function runCli() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  if (args.includes("--list")) {
    printBanner();
    console.log("Directorio de Curadores y Tesorerías en Base L2:\n");
    for (const c of getAllCurators()) {
      console.log(`• [${c.id}] ${c.name} (${c.entityType})`);
      console.log(`  Bóveda/Multisig: ${c.deployments[0]?.address || "N/A"}`);
      console.log(`  Volumen típico: ${formatUsd(c.defaultMonthlyVolumeUsd)}/mes\n`);
    }
    process.exit(0);
  }

  // Parseo de argumentos por banderas
  let curatorArg: string | undefined;
  let volumeArg: number | undefined;
  let walletArg: string | undefined;
  let formatArg: string = "all";
  let outputDirArg: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--curator" && args[i + 1]) {
      curatorArg = args[++i].toLowerCase();
    } else if (args[i] === "--volume" && args[i + 1]) {
      volumeArg = parseHumanNumber(args[++i]);
    } else if (args[i] === "--wallet" && args[i + 1]) {
      walletArg = args[++i];
    } else if (args[i] === "--format" && args[i + 1]) {
      formatArg = args[++i].toLowerCase();
    } else if (args[i] === "--output" && args[i + 1]) {
      outputDirArg = args[++i];
    }
  }

  let curator: CuratorProfile;
  let monthlyVolume: number;
  let referralWallet: string;

  // Si se pasaron parámetros no interactivos suficientes
  if (curatorArg) {
    const found = getCuratorById(curatorArg);
    if (!found) {
      console.error(`Error: Curador "${curatorArg}" no encontrado. Usa --list para ver los disponibles.`);
      process.exit(1);
    }
    curator = found;
    monthlyVolume = volumeArg || curator.defaultMonthlyVolumeUsd;
    referralWallet = walletArg || curator.defaultReferralWallet;
  } else {
    // Modo interactivo
    printBanner();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Selecciona el Curador o DAO objetivo en Base L2:\n");
    const curatorsList = getAllCurators();
    curatorsList.forEach((c, idx) => {
      console.log(`  [${idx + 1}] ${c.name.padEnd(30)} (Vol. Base: ${formatUsd(c.defaultMonthlyVolumeUsd)}/mes)`);
    });
    console.log(`  [${curatorsList.length + 1}] Curador o Bóveda Personalizada (Custom)`);

    const selectionStr = await promptAsync(rl, `\nIngresa número [1-${curatorsList.length + 1}] (default: 1): `);
    const selection = parseInt(selectionStr || "1", 10);

    if (selection >= 1 && selection <= curatorsList.length) {
      curator = curatorsList[selection - 1];
    } else {
      const customName = (await promptAsync(rl, "Nombre del Curador / Protocolo: ")) || "Custom Partner";
      const customWallet = (await promptAsync(rl, "Billetera EVM de Referido (0x...): ")) || "0x1111111111111111111111111111111111111111";
      curator = {
        id: "custom",
        name: customName,
        entityType: "morpho_curator",
        roleDescription: "Curador / Gestor institucional de deuda y bóvedas en Base L2.",
        governanceUrl: "https://base.org",
        contactChannels: {},
        deployments: [
          {
            name: `${customName} Primary Vault`,
            address: customWallet,
            network: "Base Mainnet (8453)",
            asset: "USDC",
          },
        ],
        defaultReferralWallet: customWallet,
        defaultMonthlyVolumeUsd: 25_000_000,
        painPoints: [
          "Penalizaciones de liquidación del 5% que dañan el rendimiento del fondo.",
          "Comisiones ocultas en agregadores de deuda tradicionales.",
        ],
        strategicBenefits: [
          "Tarifa plana del 0.25% sin comisiones ocultas.",
          "20% Builder Revenue Share (5 bps) pagado en el mismo bloque.",
        ],
      };
    }

    const defaultVolStr = formatUsd(curator.defaultMonthlyVolumeUsd);
    const volInput = await promptAsync(
      rl,
      `Volumen mensual objetivo en USD [default: ${defaultVolStr}]: `
    );
    monthlyVolume = volInput ? parseHumanNumber(volInput) : curator.defaultMonthlyVolumeUsd;

    const walletInput = await promptAsync(
      rl,
      `Billetera de Referido para Builder Revenue Share [default: ${curator.defaultReferralWallet}]: `
    );
    referralWallet = walletInput || curator.defaultReferralWallet;

    rl.close();
  }

  console.log(`\n================================================================================`);
  console.log(`[*] Conectando con el Gateway MCP Público en Base L2...`);
  console.log(`    URL: ${DEFAULT_MCP_GATEWAY_URL}`);
  console.log(`    Curador: ${curator.name}`);
  console.log(`    Volumen Mensual: ${formatUsd(monthlyVolume)} (${formatUsd(monthlyVolume * 12)}/año)`);
  console.log(`    Billetera de Referido: ${referralWallet}`);
  console.log(`================================================================================\n`);

  const startTime = Date.now();
  const liveQuote = await quoteRescueLive(monthlyVolume, referralWallet);
  const latency = Date.now() - startTime;

  console.log(`[+] Cotización Obtenida con éxito (${latency}ms) [Fuente: ${liveQuote.source}]`);
  console.log(`    Tarifa Total FlashShift (0.25%): ${formatUsd(liveQuote.totalFeeUsd)}`);
  console.log(`    Reparto Protocolo (80% / 0.20%):  ${formatUsd(liveQuote.protocolFeeUsd)}`);
  console.log(`    Revenue Share Socio (20% / 0.05%): ${formatUsd(liveQuote.builderFeeUsd)}`);
  console.log(`    Penalización Evitada (5.00%):     ${formatUsd(liveQuote.penaltySavedUsd)}`);
  console.log(`    Ahorro Neto Depositantes (4.75%): ${formatUsd(liveQuote.netSavingsUsd)}\n`);

  // Cálculo de proyecciones anuales
  const projection = await calculatePartnershipProjection({
    curatorName: curator.name,
    referralWallet,
    monthlyVolumeUsd: monthlyVolume,
  });

  console.log(`================================================================================`);
  console.log(`               PROYECCIÓN ECONÓMICA B2B (REVENUE SHARE 80/20)                  `);
  console.log(`================================================================================`);
  console.log(`  Socio Institucional:               ${projection.curatorName}`);
  console.log(`  Volumen Anual Protegido:           ${formatUsd(projection.annualVolumeUsd)} USD`);
  console.log(`  Penalizaciones MEV Evitadas:       ${formatUsd(projection.depositorProtection.annualLiquidationPenaltiesAvoidedUsd)} USD/año`);
  console.log(`  Ahorro Neto Real de Depositantes:  ${formatUsd(projection.depositorProtection.annualNetSavingsUsd)} USD/año`);
  console.log(`  Slippage Evitado (Chunking):       ${formatUsd(projection.depositorProtection.chunkingSlippageSavingsEstimateUsd)} USD/año`);
  console.log(`  ------------------------------------------------------------------------------`);
  console.log(`  GANANCIA PASIVA CURADOR (5 bps):   ${formatUsd(projection.partnerEarnings.annualUsd)} USDC/año`);
  console.log(`  GANANCIA MENSUAL CURADOR:          ${formatUsd(projection.partnerEarnings.monthlyUsd)} USDC/mes`);
  console.log(`  PROYECCIÓN 3 AÑOS CURADOR:         ${formatUsd(projection.partnerEarnings.threeYearUsd)} USDC`);
  console.log(`================================================================================\n`);

  const pitches = generateAllPitches(projection, curator);

  if (formatArg === "forum" || formatArg === "all") {
    console.log(`\n>>> PROPUESTA PARA FORO DE GOBERNANZA (MARKDOWN) <<<\n`);
    console.log(pitches.governanceForum);
    console.log(`\n--------------------------------------------------------------------------------\n`);
  }

  if (formatArg === "discord" || formatArg === "all") {
    console.log(`\n>>> MENSAJE CORTO PARA DISCORD (#PARTNERSHIPS / #RISK) <<<\n`);
    console.log(pitches.discord);
    console.log(`\n--------------------------------------------------------------------------------\n`);
  }

  if (formatArg === "telegram" || formatArg === "all") {
    console.log(`\n>>> PITCH EJECUTIVO PARA TELEGRAM (DM A LÍDERES DE RIESGO) <<<\n`);
    console.log(pitches.telegram);
    console.log(`\n--------------------------------------------------------------------------------\n`);
  }

  // Generación de configuración MCP lista para copiar
  console.log(`================================================================================`);
  console.log(`          CONFIGURACIÓN MCP (MODEL CONTEXT PROTOCOL) PARA EL CURADOR            `);
  console.log(`================================================================================`);
  const mcpConfig = {
    mcpServers: {
      "santa-rosa": {
        url: DEFAULT_MCP_GATEWAY_URL,
        headers: {
          "x-referral-wallet": referralWallet,
          "x-partner-id": curator.id,
        },
      },
    },
  };
  console.log(JSON.stringify(mcpConfig, null, 2));

  console.log(`\nComando cURL de prueba rápida para su equipo técnico:`);
  console.log(`curl -s -X POST ${DEFAULT_MCP_GATEWAY_URL} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"quote_debt_rescue","arguments":{"borrowedAmountUsd":${monthlyVolume},"referralAddress":"${referralWallet}"}}}'
`);

  // Guardado en disco si se solicitó o creación de archivo de propuesta
  if (outputDirArg) {
    const targetDir = path.resolve(outputDirArg);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const fileName = `propuesta_${curator.id}_${Date.now()}.md`;
    const fullPath = path.join(targetDir, fileName);
    fs.writeFileSync(fullPath, pitches.governanceForum, "utf-8");
    console.log(`[✓] Propuesta guardada en: ${fullPath}`);
  }
}

runCli().catch((err) => {
  console.error("Error fatal en Partner Acquisition CLI:", err);
  process.exit(1);
});
