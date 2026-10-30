# Mecánica de Cobro del Arbitraje de APY Puro (Carry Trade)

> [!IMPORTANT]
> **La Diferencia Fundamental:**
> * Un arbitraje de precios en DEX te da la ganancia **en 1 bloque** (compras a $100 y vendes a $102).
> * Un arbitraje de APY (tasa de interés) genera la ganancia **en el tiempo** (el diferencial entre lo que cobras de rendimiento y lo que pagas de deuda cada segundo).
> 
> Aquí se explica exactamente cómo se extrae ese dinero y cómo se cobra.

---

## 1. La Operación Base (El Carry Trade)

Supongamos que armamos la estrategia con **$1.000.000 USDC**:
1. Usamos un Flash Loan de Morpho para apalancar la posición (ej: colateral 1M, pedimos prestado 3M).
2. **Pedimos prestado en Aave v3 al 4.61% anual.**
3. **Depositamos en el Vault de Morpho (Steakhouse/Re7) al 6.07% anual.**
4. **El Spread Bruto:**
   $$6.07\% - 4.61\% = \mathbf{+1.46\%\text{ anual}}$$
5. Sobre una posición apalancada de $3.000.000, ese 1.46% genera:
   $$\$3.000.000 \times 1.46\% = \mathbf{\$43.800\text{ USD limpios al año}}$$
   ($120 USD por día acumulados segundo a segundo).

---

## 2. ¿Cómo se Extrae y se Cobra ese Dinero en la Blockchain?

Hay 2 formas exactas de cobrar este arbitraje:

### Opción A: Si es Capital de un Tercero / Fondo (Modelo Vault ERC-4626)
Creas un contrato de estrategia / Vault donde los usuarios o fondos depositan USDC:
* La estrategia corre el arbitraje de APY entre Aave y Morpho.
* **Cómo cobras TÚ (Management / Performance Fee):**
  - El contrato tiene un `harvest()` o actualización de balance.
  - Cada vez que el rendimiento de Morpho entra al contrato:
    1. Paga el interés de la deuda en Aave.
    2. Del sobrante neto (los $43.800 USD), el contrato retiene tu **Performance Fee (ej. 20%)**:
       $$\text{Tu Ganancia} = \$43.800 \times 20\% = \mathbf{\$8.760\text{ USD/año}}$$
    3. Esos dólares van directo a tu billetera `feeRecipient`.
    4. El resto (80%) se le suma al balance del inversor.

---

### Opción B: Si es con Tu Propio Capital (Ganancia 100% Tuya)
Si tú fondeas el contrato con tu propio colateral inicial (o el de tu equipo):
* No hay intermediarios ni clientes.
* El contrato mantiene abierta la posición:
  - Cada semana o cada mes, llamas a la función:
    ```solidity
    function claimProfit() external onlyOwner {
        // Retira el exceso de intereses generados en Morpho
        // tras verificar que la salud en Aave sigue perfecta
        IERC20(usdc).transfer(owner, profit);
    }
    ```
* Retiras los dólares generados por el spread directamente a tu billetera.

---

### Opción C: El "Swap de Tasa de Interés" Fijo a Plazo (Fixed Rate Arbitrage)
Si un usuario o un bot quiere asegurar una tasa fija y tú le arbitras la flotante:
* Tú le garantizas al usuario que pagará **5.50%** fijo.
* Tú financias la deuda en Aave al **4.61%** variable.
* **Tu Ganancia en el Momento:**
  - Cobras el diferencial del spread por adelantado o lo vas debitando del flujo de su posición.
