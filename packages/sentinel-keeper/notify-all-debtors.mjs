import fs from "fs";
import { createWalletClient, createPublicClient, http, parseEther, toHex, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

/**
 * Web3 Direct Memo Engine (On-Chain Liquidation Defense)
 * Broadcasts UTF-8 warning calldata transactions directly to at-risk debtor wallets on Base L2.
 * Mobile wallets (Rabby, DeBank, Zerion, Rainbow, Coinbase Wallet) display instant PUSH alerts.
 */
async function notifyDebtors(dryRun = true, maxTargets = 10) {
  console.log("================================================================================");
  console.log(`🚨 WEB3 DIRECT MEMO: ON-CHAIN DEBTOR ALERT DISPATCHER (BASE L2) [Mode: ${dryRun ? "DRY-RUN (Simulation)" : "LIVE BROADCAST"}]`);
  console.log("================================================================================\n");

  // 1. Load target positions exported by Sentinel Keeper
  let targets = [];
  try {
    const raw = fs.readFileSync("./packages/sentinel-keeper/all-at-risk-positions.json", "utf8");
    targets = JSON.parse(raw);
  } catch {
    console.log("Loading positions from memory scan...");
  }

  if (targets.length === 0) {
    console.log("No positions found on disk. Run scan-all-liquidations.mjs or sentinel.mjs first.");
    return;
  }

  // 2. Load registry of previously notified wallets to avoid duplication
  const notifiedFile = "./packages/sentinel-keeper/notified-wallets.json";
  let notifiedWallets = new Set();
  try {
    if (fs.existsSync(notifiedFile)) {
      const recorded = JSON.parse(fs.readFileSync(notifiedFile, "utf8"));
      recorded.forEach(w => notifiedWallets.add(w.toLowerCase()));
    }
  } catch (e) {}

  // Filter positions with debt >= $100 USD that have not been notified
  const priorityTargets = targets
    .filter(t => t.debtUsd >= 100 && !notifiedWallets.has(t.wallet.toLowerCase()))
    .sort((a, b) => b.debtUsd - a.debtUsd)
    .slice(0, maxTargets);

  console.log(`🎯 Selected ${priorityTargets.length} priority debtor wallets pending notification:\n`);

  priorityTargets.forEach((t, i) => {
    console.log(
      `${(i + 1).toString().padStart(2, " ")}. Wallet: ${t.wallet} | Pair: ${t.pair} | Debt: $${t.debtUsd.toLocaleString()} | HF: ${t.healthFactor} | User Savings: +$${t.userSavingsUsd.toLocaleString()} | Potential Fee: +$${t.projectedTreasuryFeeUsd} USDC`
    );
  });

  // Read wallet from .env if not dryRun
  let account;
  if (!dryRun) {
    const envContent = fs.readFileSync("C:\\Users\\Lucas\\OneDrive\\Escritorio\\lcf\\.env", "utf8");
    const m = envContent.match(/PRIVATE_KEY=["']?([a-fA-F0-9]+)["']?/);
    if (!m) throw new Error("No private key found in .env");
    const key = m[1].startsWith("0x") ? m[1] : "0x" + m[1];
    account = privateKeyToAccount(key);
    console.log(`\n🔑 Sender Treasury Wallet: ${account.address}`);
  }

  const publicClient = createPublicClient({ chain: base, transport: http("https://mainnet.base.org") });

  console.log("\n📦 Preparing On-Chain Memos for each debtor:\n");

  for (const t of priorityTargets) {
    const memoText = `LIQUIDATION ALERT: Morpho Base HF ${t.healthFactor}. Avoid losing $${Math.round(t.debtUsd * 0.05).toLocaleString()} penalty. 1-Click Rescue: https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57#writeContract or Gateway: https://sunset-determining-budget-deluxe.trycloudflare.com`;
    const memoHex = toHex(memoText);

    console.log(`────────────────────────────────────────────────────────────────────────────────`);
    console.log(`Recipient: ${t.wallet}`);
    console.log(`At-Risk Debt: $${t.debtUsd.toLocaleString()} USD | Pair: ${t.pair}`);
    console.log(`Memo Text: "${memoText}"`);
    console.log(`Data Hex: ${memoHex.slice(0, 66)}... (${memoHex.length / 2} bytes)`);

    if (!dryRun && account) {
      const walletClient = createWalletClient({ account, chain: base, transport: http("https://mainnet.base.org") });
      try {
        const code = await publicClient.getBytecode({ address: t.wallet });
        const isContract = code && code !== "0x";
        if (isContract) {
          console.log(`ℹ️ Target is a Smart Contract/Vault. Broadcasting alert...`);
        }

        const hash = await walletClient.sendTransaction({
          to: t.wallet,
          value: parseEther("0.0000001"), // 100 nano-ETH dust to trigger mobile wallet push alert
          data: memoHex
        });
        console.log(`✅ Tx Broadcast On-Chain: https://basescan.org/tx/${hash}`);
        notifiedWallets.add(t.wallet.toLowerCase());
        fs.writeFileSync(notifiedFile, JSON.stringify(Array.from(notifiedWallets), null, 2));
      } catch (err) {
        console.error(`❌ Error broadcasting to ${t.wallet}:`, err.shortMessage || err.message);
        // Mark to prevent repeated attempts if it is a contract without fallback
        notifiedWallets.add(t.wallet.toLowerCase());
        fs.writeFileSync(notifiedFile, JSON.stringify(Array.from(notifiedWallets), null, 2));
      }
    }
  }

  console.log("\n================================================================================");
  console.log(dryRun ? "🏁 SIMULATION FINISHED (DRY-RUN). No transactions were sent." : "🚀 ALL ON-CHAIN NOTIFICATIONS BROADCASTED TO BASE MAINNET.");
  console.log("================================================================================");
}

// Ejecutar en dry-run por defecto
const isLive = process.argv.includes("--live");
const maxArg = process.argv.find(a => a.startsWith("--limit="));
const limit = maxArg ? Number(maxArg.split("=")[1]) : 10;

notifyDebtors(!isLive, limit).catch(console.error);
