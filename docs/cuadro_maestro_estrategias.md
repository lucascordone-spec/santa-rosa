# Cuadro Maestro de Estrategias y Servicios — FlashShift (Base) — v2

> [!NOTE]
> **Modelo:** 100% Software como Servicio (SaaS / API / MCP / Routing). No custodial, cero capital propio en riesgo, cero comisiones de flash loan (Morpho Blue 0.00% fee).

---

## 1. El Cuadro Integral de las 10 Estrategias

| # | Estrategia / Servicio | Clima de Mercado | Problema que Resuelve | Cómo Opera la Tecnología | Tarifa FlashShift (% del Volumen) | Ganancia Típica por Operación | Beneficio / Ahorro para el Cliente |
|---|---|---|---|---|---|---|---|
| **1** | **Rescate Anti-Liquidación (Deleveraging)** | 🚨 Pánico / Crisis / Depeg | Posición con Health Factor < 1.05 a punto de ser liquidada. | Flash loan 0% Morpho repaga 25% deuda ➔ Retira colateral ➔ Swap en DEX ➔ Devuelve flash loan ➔ HF sube a 1.25. | **0.15%** (15 bps) | **$7.500 USD** (en op. de $5M) | Se ahorra el 5% al 10% de penalización ($250k a $500k USD). |
| **2** | **Cierre Total en 1 Clic (Close Position)** | 🚪 Salida / Emergencia | Salir de un préstamo de $10M requiere conseguir $10M líquidos primero. | Flash loan paga 100% deuda ➔ Retira 100% colateral ➔ Vende deuda exacta ➔ Devuelve neto al usuario. | **0.15%** (15 bps) | **$15.000 USD** (en op. de $10M) | Cierra sin poner 1 dólar y sin fricción de 5 transacciones. |
| **3** | **Arbitraje de APY / Refinanciamiento** | 🔄 Día a día / Tranquilo | Pagando 6.66% en Morpho cuando Aave v3 cobra 4.61% en USDC. | Flash loan cancela deuda cara en Morpho ➔ Mueve colateral ➔ Abre deuda barata en Aave ➔ Devuelve flash loan. | **0.05% a 0.10%** (5 a 10 bps) | **$5.000 a $10.000 USD** (en op. de $10M) | Se ahorra $204.000 USD/año en intereses de por vida. |
| **4** | **Rotación entre Mercados Morpho (Market Switch)** | 🔄 Optimización Diaria | Mercado de Morpho con interés inflado por alta utilización. | Flash loan mueve deuda de mercado caro a mercado curado con menor tasa. | **0.05%** (5 bps) | **$2.500 USD** (en op. de $5M) | Reduce APY entre 1% y 2.5% anual en un solo clic. |
| **5** | **Apalancamiento en 1 Clic (Multiply / Looping)** | 🚀 Bull Market / Rendimiento | Hacer 6 loops manuales de WETH ➔ wstETH o USDe para ganar 3x yield. | Flash loan pide el capital total de golpe ➔ Compra en DEX ➔ Deposita y abre deuda final en 1 bloque. | **0.08%** (8 bps) | **$4.000 USD** (en loop de $5M) | 1 transacción en 3 segundos vs 6 transacciones con slippage. |
| **6** | **Upgrade de Colateral (Collateral Switch)** | 📈 Rendimiento Pasivo | Colateral inactivo en WETH pelado sin ganar staking yield. | Flash loan libera WETH ➔ Swappea a wstETH ➔ Redeposita sin tocar la deuda de USDC. | **0.05%** (5 bps) | **$2.500 USD** (en swap de $5M) | Gana +3.2% de staking yield anual sobre su colateral. |
| **7** | **Cambio de Deuda (Debt Switch)** | ⚖️ Gestión de Exposición | Deuda en activo volátil que empieza a subir o deuda cara. | Flash loan cancela deuda A ➔ Abre deuda B ➔ Swappea y devuelve flash loan. | **0.05% a 0.10%** | **$2.500 a $5.000 USD** | Cambia el perfil de riesgo sin vender colateral. |
| **8** | **Router Flash Loan 0% para Bots de Arbitraje** | 🤖 24/7 / Automático | Bots de arbitraje apagan por pagar 0.05% de flash loan en Aave. | Nuestro router les da Flash Loans de Morpho al 0.00% permanente para swaps en DEXs. | **Rebate DEX (0.02% a 0.04%)** | **$50 a $500 USD / día** pasivos | El bot vuelve a ser rentable al no pagar peaje de préstamo. |
| **9** | **Herramientas MCP & API para Agentes de IA** | 🤖 Ecosistema Base | Agentes de Coinbase AgentKit / ElizaOS sin primitivas de deuda. | Servidor MCP 100% GRATIS para simular con `eth_call`. La comisión se cobra en la ejecución on-chain. | **0.15% en ejecución** (Simulación GRATIS) | **$1.500 a $15.000 USD** por orden | El agente opera de forma autónoma sin intervención humana. |
| **10** | **SWAP DIRECTO / SPOT AGGREGATOR (Agregador de Swaps)** | 💱 Siempre / Diario | Usuarios, ballenas y bots que necesitan cambiar tokens comunes (ej. ETH a USDC) con mínimo slippage. | Ruteo multiruta dividiendo la orden en 12-15 pools (Uniswap, Aerodrome, Curve) vía Kyber/Odos. | **Partner Fee / Markup (0.05% a 0.10%)** | **$50 a $2.500 USD** por swap grande | Consiguen el mejor precio de Base sin mover el mercado, y nosotros cobramos comisión directa del swap. |

---

## 2. Mapa Estratégico por Clima de Mercado

```
                    ┌──────────────────────────────────────────────┐
                    │      FLASHSHIFT: 100% SOFTWARE SERVICE       │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
   MERCADO ALCISTA                 MERCADO TRANQUILO                  MERCADO EN CRISIS
   (Bull Market)                   (Lateral / Rango)                  (Crash / Depeg / Pánico)
   ───────────────                 ─────────────────                  ────────────────────────
   • Apalancamiento 1-Clic         • Arbitraje de APY (Aave-Morpho)   • Rescates Anti-Liquidación
   • Upgrade a wstETH / cbETH      • Rotación de Mercados Morpho      • Cierres Totales de Emergencia
   • Swaps Directos de Compra      • Swaps Spot & Rebalanceos         • Desapalancamiento Preventivo
   • Swaps de Deuda                • Router 0% para Bots Arbitraje    • Swaps Directos de Salida
   ───────────────                 ─────────────────                  ────────────────────────
   Objetivo: MULTIPLICAR           Objetivo: OPTIMIZAR INTERESES      Objetivo: SALVAR CAPITAL
```
