# Estrategia de Precios Competitiva — FlashShift vs DeFi Saver

> [!IMPORTANT]
> **La Tesis Comercial:** DeFi Saver cobra hasta **0.30% (30 bps)** sumando comisiones ocultas de ejecución automática. Nosotros simplificamos todo: somos más baratos para el cliente, eliminamos las comisiones ocultas y creamos el **sistema de incentivos para desarrolladores (referidos) más potente de Base**.

---

## 1. La Comparativa Directa: FlashShift vs DeFi Saver

| Servicio / Operación | DeFi Saver (Líder) | FlashShift (Nuestra Propuesta) | Diferencial Comercial |
|---|---|---|---|
| **Rescate / Cierre Automático** | **0.30% (30 bps)**<br/>*(0.25% swap + 0.05% auto)* | **0.25% (25 bps)**<br/>*(Todo incluido)* | **17% más barato** que DeFi Saver y 95% más barato que una liquidación |
| **Swaps No Correlacionados** (ETH/USDC) | **0.25% (25 bps)** | **0.20% (20 bps)** | **20% más barato** directo |
| **Comisión de Ejecución Automática** | **+0.05% EXTRA** | **$0.00 (GRATIS)** | Cero comisiones ocultas |
| **Reparto a Desarrolladores / Referidos** | **0.00%** (Se quedan todo) | **0.05% (5 bps)** directo | El **20% de todo el fee** va al builder |

---

## 2. El Reparto Matemático en Rescates (0.25% Total)

En cada rescate o cierre automático cobramos **0.25% (25 bps)** y el contrato lo divide en el mismo bloque:

* **FlashShift (Protocolo):** **0.20% (20 bps)** ➔ 80% del ingreso.
* **Builder / Desarrollador (Referido):** **0.05% (5 bps)** ➔ 20% del ingreso.

```
┌────────────────────────────────────────────────────────────────────────┐
│             DISTRIBUCIÓN DE RESCATE FLASHSHIFT (0.25% TOTAL)           │
├────────────────────────────────────────────────────────────────────────┤
│ Total cobrado al usuario:                       0.25% (25 bps)         │
│                                                                        │
│   ├── Para FlashShift (Tesorería):              0.20% (20 bps)         │
│   └── Para el Dev / Agente (Referido):          0.05% (5 bps)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Impacto en Números Reales (Casos de Estudio en Base)

### Caso 1: Rescate de Ballena ($10.000.000 USDC)
* **Lo que pagaría en DeFi Saver:** $30.000 USD (0.30%).
* **Lo que paga con FlashShift:** **$25.000 USD** (0.25%).
  - La ballena se ahorra **$5.000 USD** de entrada.
* **El Reparto On-Chain en FlashShift:**
  - **$20.000 USD** van a nuestra billetera de tesorería.
  - **$5.000 USD** van directamente al desarrollador del bot/agente (`referralAddress`).

### Caso 2: Cierre Mediano ($2.000.000 USDC)
* **Total cobrado:** $5.000 USD.
* **FlashShift:** **$4.000 USD**.
* **Desarrollador / Agente:** **$1.000 USD**.

---

## 4. Por qué esta Idea es una Jugada Maestra

1. **Destroza a DeFi Saver en Marketing:**
   - DeFi Saver te cobra 0.25% + 0.05% de ejecución. Tú sales diciendo: *"Cero comisiones ocultas de automatización: 0.25% tarifa plana todo incluido"*.
2. **Convierte a los Desarrolladores en tu Fuerza de Ventas:**
   - Ningún bot o agente va a enrutar por DeFi Saver porque DeFi Saver **no les paga nada**.
   - En FlashShift, el desarrollador que programa el agente de tesorería se lleva **$5.000 dólares en la mano** por cada operación de $10M.
3. **Sube nuestra Facturación:**
   - Antes proyectábamos un fee de 0.15% para nosotros. Ahora capturamos **0.20% neto para FlashShift** (un 33% más de ingresos) y aun así somos más baratos que el líder del mercado.
