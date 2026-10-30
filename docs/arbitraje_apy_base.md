# Arbitraje de APY: Morpho ⟷ Aave v3 en Base

---

## 1. Los Datos en Vivo Directo de la Blockchain (Base)

Leímos directamente el contrato de Aave v3 (`0xA238...d1c5`) y los mercados de Morpho Blue:

| Activo | Tasa Aave v3 (Borrow APY) | Tasa Morpho Blue (Borrow APY) | Spread / Oportunidad de Arbitraje |
|---|---|---|---|
| **cbBTC / USDC** | **4.61%** | **5.72%** | **+1.11%** (Aave es más barato para pedir prestado) |
| **mGLO / USDC** | **4.61%** | **6.66%** | **+2.05%** (Aave es mucho más barato) |
| **cbXRP / USDC** | **4.61%** | **6.94%** | **+2.33%** (Aave es más barato) |
| **USDe / USDC** | **4.61%** | **4.48%** | **+0.13%** (Morpho es más barato) |

---

## 2. Los Dos Tipos de "Arbitraje de APY"

### Tipo 1: Arbitraje de Refinanciamiento (Para Usuarios y Agentes)
* **El Problema:** La ballena con $15M en `mGLO/USDC` está pagando **6.66% anual** en Morpho.
  - En Aave v3 la tasa de USDC es de **4.61% anual**.
  - Esa ballena está **tirando a la basura $307.500 USD al año** en intereses innecesarios (un spread del **2.05%**).
* **Cómo opera FlashShift (Arbitraje Atómico con Flash Loan 0%):**
  1. El bot corre `eth_call` y detecta el spread: `Spread > 1.0%`.
  2. Pide un Flash Loan en Morpho (0% fee).
  3. Cancela la deuda cara en Morpho.
  4. Retira el colateral.
  5. Lo deposita en Aave y toma el préstamo barato al 4.61%.
  6. Devuelve el Flash Loan a Morpho.
* **El Negocio:** Le ahorras $307.500 USD al año y le cobras **0.05% de fee ($7.500 USD)** en la transacción.

---

### Tipo 2: Yield / Carry Trade Arbitrage (Rendimiento Pasivo Apalancado)
* **La Tesis:** Pedir prestado donde la tasa es baja y depositar donde el rendimiento es alto.
  - En Aave pides prestado USDC al **4.61%**.
  - En Morpho suministras USDC en vaults como Steakhouse o Re7 al **5.15% - 6.07%**.
* **El Spread neto:** **0.54% a 1.46% anual limpio**.
* **Con apalancamiento flash (5x):** Ese spread del 1.4% se convierte en un **7.0% a 9.0% APY puro sobre capital de bajo riesgo**.
