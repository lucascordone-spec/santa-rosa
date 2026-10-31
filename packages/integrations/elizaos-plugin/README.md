# @santa-rosa/plugin-elizaos

Official [ElizaOS](https://github.com/elizaos/eliza) Plugin for **Santa Rosa Protocol**: Autonomous DeFi anti-liquidation rescue, 0.00% fee Morpho Blue flash loans, and **0.05% on-chain builder revenue share** on **Base L2 (ChainId: 8453)**.

---

## ⚡ Why Add Santa Rosa to Your Eliza Agent?

1. **Autonomous Liquidation Defense**: Your AI agent monitors lending vaults (Morpho Blue & Aave v3) on Base and proactively prevents toxic MEV liquidations.
2. **20x Cheaper than Liquidation**: External liquidators take a 5% penalty. Santa Rosa charges only 0.25%, saving users ~95% of their capital.
3. **Builder Revenue Share (0.05% in USDC)**: Every time your Eliza agent simulates or executes a debt rescue, **0.05% of the transaction volume** (20% of the protocol fee) is transferred directly to your configured wallet on Base in the same block.

### Financial Incentive Matrix
| Rescued Debt (USD) | Standard MEV Penalty (5%) | Santa Rosa Fee (0.25%) | Net User Saved | **Eliza Developer Fee (0.05% USDC)** |
| :--- | :--- | :--- | :--- | :--- |
| **$50,000** | $2,500 | $125 | **$2,375** | **$25.00** |
| **$200,000** | $10,000 | $500 | **$9,500** | **$100.00** |
| **$1,000,000** | $50,000 | $2,500 | **$47,500** | **$500.00** |

---

## 📦 Installation

```bash
npm install @santa-rosa/plugin-elizaos @elizaos/core viem zod
```

---

## ⚙️ Configuration in `character.json`

Add the plugin to your Eliza character file:

```json
{
  "name": "DeFi Guardian",
  "plugins": [
    "@santa-rosa/plugin-elizaos"
  ],
  "settings": {
    "secrets": {
      "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere",
      "SANTA_ROSA_GATEWAY_URL": "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"
    }
  }
}
```

Or configure environment variables in your `.env`:

```env
SANTA_ROSA_PARTNER_WALLET=0xYourBaseAddressHere
SANTA_ROSA_GATEWAY_URL=https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
```

---

## 🤖 Available Eliza Actions

### 1. `MONITOR_DEBT_POSITIONS`
* **Trigger**: *"Revisa mis posiciones de deuda en Base"*, *"Check liquidation risk for 0x10c53e..."*
* **Function**: Scans Morpho Blue and Aave v3 markets on Base, checking collateral, debt, borrow APYs, and Health Factor.

### 2. `SIMULATE_RESCUE_SAVINGS`
* **Trigger**: *"Simula el rescate de mi posición de $100k"*, *"Cuánto ahorro si rescato con Santa Rosa?"*
* **Function**: Runs a gasless simulation proving the 20x savings versus liquidator penalties and displays the developer's 0.05% USDC reward.

### 3. `EXECUTE_DEBT_RESCUE`
* **Trigger**: *"Ejecuta el rescate preventivo"*, *"Prepara la transacción para salvar mi vault"*
* **Function**: Generates calldata payload ready to sign on Base targeting the Santa Rosa Router (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`).

---

## 💬 Sample Multi-Turn Conversation

```text
User: ¿Tengo riesgo de liquidación en Base para la wallet 0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c?

Agent: 🔍 [Santa Rosa Position Monitor]
Posición activa en Morpho Blue (WETH/USDC):
• Colateral: $105,000 USD (WETH)
• Deuda: $100,000 USD (USDC)
• Health Factor: 1.012 — 🚨 PELIGRO INMINENTE
ALERTA: Tu posición está a 1.2% de ser liquidada por un bot MEV con penalización del 5% ($5,000 USD).

User: ¿Cuánto me costaría rescatarla con Santa Rosa?

Agent: ⚡ [Simulación de Rescate Santa Rosa]
• Health Factor Proyectado: 1.450 (ZONA SEGURA)
• Penalización Liquidación Evitada (5%): -$5,000 USD
• Tarifa Plana Santa Rosa (0.25%): -$250 USD
💰 Ahorro Neto en tu Bolsillo: +$4,750 USD (20.0x más barato)
🤝 Rev-Share Builder (0.05%): $50.00 USDC transferido en el mismo bloque.
¿Deseas que prepare la transacción de rescate atómico?
```

---

## 🔗 Official Protocol References
* **Base Router Mainnet**: [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
* **Live MCP Gateway**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
* **GitHub Repository**: [lucascordone-spec/santa-rosa](https://github.com/lucascordone-spec/santa-rosa)
