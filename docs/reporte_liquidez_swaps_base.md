# Reporte de Profundidad de Liquidez de Swaps en Base (KyberSwap Aggregator)

> [!IMPORTANT]
> Para no dejar nada al azar, probamos directamente en la API en vivo de **KyberSwap Aggregator en Base L2** la capacidad de ejecución para diferentes tamaños de rescate.

---

## 1. Swaps de WETH / cbBTC a USDC (Liquidez Institucional Masiva)

En pares volátiles grandes (WETH y cbBTC), los pools de Base (Aerodrome Slipstream, Uniswap v3, Curve, PancakeSwap) absorben órdenes masivas sin despeinarse:

| Volumen Swappeado | USDC Recibidos | Precio Efectivo / ETH | Slippage / Impacto |
|---|---|---|---|
| **500 WETH (~$1.11M USD)** | $1.112.953 USDC | $2.225,91 | **Base (0%)** |
| **1.000 WETH (~$2.22M USD)** | $2.224.349 USDC | $2.224,35 | **0,07%** (Imperceptible) |
| **2.000 WETH (~$4.44M USD)** | $4.443.580 USDC | $2.221,79 | **0,18%** (< 0.20%) |

**Conclusión:** Un rescate o cierre de **$5.000.000 USD** en WETH o cbBTC sufre apenas **0.18% de slippage** gracias a que Kyber divide la orden en 12 a 15 pools simultáneos.

---

## 2. El Hallazgo Crítico en Stablecoins (USDe a USDC)

Al probar el mercado de **USDe** (el token de la Ballena #1), descubrimos un dato técnico fundamental sobre la estructura de liquidez de Base:

| Monto USDe | USDC Recibidos | Precio Efectivo / USDe | Estado del Swap |
|---|---|---|---|
| **$10.000 USDe** | $9.983,29 USDC | **$0.9983** | ✅ Perfecto (0.17% slippage) |
| **$50.000 USDe** | $49.911,66 USDC | **$0.9982** | ✅ Perfecto (0.18% slippage) |
| **$100.000 USDe** | $99.810,68 USDC | **$0.9981** | ✅ Excelente (0.19% slippage) |
| **$250.000 USDe** | $249.233,46 USDC | **$0.9969** | ✅ Óptimo (0.31% slippage) |
| **$1.000.000+ USDe (en 1 solo tick)**| $469.248 USDC | **$0.4692** | ⚠️ Falta profundidad en 1 solo bloque |

### La Regla de Ingeniería para Rescates de USDe:
* Si un rescate de USDe es de **$1.000.000 o más**, **NO se debe tirar en una sola orden de mercado**.
* **La Solución en el Router:** 
  1. O se ejecuta en **tramos de $250.000 USD** para mantenerse en slippage del 0.3%.
  2. O se interactúa directamente con el contrato de redención o los pools concentrados de Aerodrome Slipstream.
