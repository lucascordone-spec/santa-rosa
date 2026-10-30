# FlashShift como SERVICIO PURO: Cobro de Arbitraje de APY sin Custodia

> [!IMPORTANT]
> **Definición Estricta:** Nosotros **NO somos un fondo, NO ponemos capital propio y NO custodiamos el dinero del usuario**. Somos un **Software / Router de Infraestructura (estilo 1inch o Instadapp)**.
> 
> El capital, la deuda y el colateral pertenecen 100% al usuario o al agente de IA.

---

## 1. El Problema del Servicio Puro

Si el dinero es del usuario y tú solo eres el software que le encuentra la mejor tasa:
* ¿Cómo le cobras a un usuario o agente por hacerle ganar dinero con el spread de APY **sin tener que perseguirlo para que te pague después**?

Hay dos mecanismos exactos y probados en DeFi:

---

## Mecanismo 1: Cobro Instantáneo en el Bloque de Ejecución (El más recomendado)

No esperas semanas a ver cuánto ganó. **Cobras en el milisegundo exacto en que tu software le ejecuta el arbitraje.**

### La Fórmula de Cobro:
Cobras un **Fee de Rebalanceo / Arbitraje de Tasa (ej. 0.10% del capital)**:
* Si la posición del usuario es de **$5.000.000 USDC**:
* Tu software le demuestra con `eth_call`:
  - *"Al moverte de Morpho (6.66%) a Aave (4.61%), te vas a ahorrar **$102.500 USD** este año"*.
  - *"Costo del servicio de arbitraje: **0.10% ($5.000 USD)** cobrado en esta transacción"*.
* **El usuario se ahorra $102.500 pagando solo $5.000.**

### Cómo se extrae el dinero on-chain (Sin que el usuario tenga saldo):
1. El Flash Loan de Morpho pide los **$5.000.000**.
2. Cancela la posición vieja.
3. Al abrir la nueva posición barata, abre una deuda por **$5.005.000**.
4. **Los $5.000 USD de diferencia van directo a tu billetera.**
5. El Flash Loan se devuelve a 0% fee.
* **Resultado:** Tú cobraste **$5.000 USD al instante**, no custodies nada, no arriesgaste tu capital, y el usuario se fue con su problema resuelto.

---

## Mecanismo 2: Delegación de Rendimiento Automatizada (Yield Fee en Proxy)

Si el usuario quiere que tu bot le arbitre la tasa **continuamente** (que lo mueva automáticamente a donde esté el mejor APY cada semana):

* El usuario crea una posición a través de un **Smart Wallet / Proxy no custodial** (estilo Safe o DeFi Saver):
  - El usuario sigue siendo el **único dueño** del proxy (puede retirar cuando quiera).
  - Pero le da un permiso restringido a tu Keeper/Bot: *"Permiso único para rebalancear deuda entre Aave y Morpho si el spread supera el 1%"*.
* **Cómo cobra el servicio:**
  - Cada vez que el bot ejecuta el rebalanceo para optimizar la tasa, el contrato proxy deduce automáticamente una pequeña comisión de éxito del capital movido y la envía a tu tesorería.

---

## 3. Resumen del Modelo de Negocio de Servicio Puro

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FLASHSHIFT (SERVICIO PURO)                        │
├────────────────────────────────┬───────────────────────────────────────┤
│ Custodia de Fondos             │ CERO (Non-custodial, 100% del usuario)│
│ Capital Propio Arriesgado      │ $0 USD                                │
│ Rol de FlashShift              │ Motor de cálculo + Calldata Router    │
│ Momento del Cobro              │ EN EL SEGUNDO DE LA TRANSACCIÓN       │
│ Forma de Cobro                 │ Deducido automáticamente en el bloque │
└────────────────────────────────┴───────────────────────────────────────┘
```
