# FlashShift — Modelo de Precios y Comisiones Definitivo

---

## 1. Tabla Oficial de Tarifas

| # | Operación | Tasa de Mercado (DeFi Saver / Otros) | Tarifa FlashShift | Notas Estratégicas |
|---|---|---|---|---|
| **1** | **Swaps de Stablecoins** | 0.01% (1 bps) | **0.01% (1 bps)** | Alineado al estándar para no penalizar a USDe/USDC/mGLO |
| **2** | **Swaps Correlacionados** | 0.10% (10 bps) | **0.05% (5 bps)** | **50% más barato** que el mercado (ETH ↔ wstETH/cbETH) |
| **3** | **Cierre / Rescate Total** | 0.25% (25 bps) | **0.15% (15 bps)** | **40% más barato** que DeFi Saver y 97% más barato que una liquidación |
| **4** | **Llamadas API / Servidor MCP** | $0.01 - $0.05 / call | **100% GRATIS** | **Efecto red:** Cero barreras para agentes (Coinbase AgentKit, ElizaOS) |

---

## 2. Impacto en la Facturación Real (Con el 0.15% en Rescate / Cierre)

Sobre los datos reales que extrajimos del log de las ballenas en Morpho en Base (repagando preventivamente el 25% de la deuda en riesgo):

| # | Billetera Ballena | Deuda Total | Flash Loan Rescate (25%) | Ingreso Previo (0.10%) | **NUEVO INGRESO (0.15%)** | Ahorro Neto para la Ballena |
|---|---|---|---|---|---|---|
| **1** | `0x7bee...0FAb` | $108.8M | $27.216.903 | $27.217 | **$40.825 USD** | **+$5.388.948** |
| **2** | `0x502D...8fB3` | $60.7M | $15.186.087 | $15.186 | **$22.779 USD** | **+$3.006.845** |
| **3** | `0xB4fb...59c1` | $28.8M | $7.210.653 | $7.211 | **$10.816 USD** | **+$1.427.710** |
| **4** | `0x6F87...92B6` | $28.0M | $7.005.115 | $7.005 | **$10.508 USD** | **+$1.387.012** |
| **5** | `0xF078...f19E` | $20.6M | $5.170.192 | $5.170 | **$7.755 USD** | **+$1.023.698** |
| **6** | `0x8986...5298` | $20.1M | $5.046.765 | $5.047 | **$7.570 USD** | **+$999.260** |
| **7** | `0xA374...Ca03` | $18.3M | $4.575.268 | $4.575 | **$6.863 USD** | **+$905.903** |
| **8** | `0xA56d...846F` | $17.6M | $4.404.915 | $4.405 | **$6.607 USD** | **+$872.174** |

### Resumen del ajuste:
* En solo estas 8 posiciones, el ingreso potencial sube de **$73.816** a **$113.723 USD**.
* La ballena sigue ahorrándose el **97%** de lo que perdería en una liquidación (un ahorro neto promedio de más de $1.000.000 USD por posición).
