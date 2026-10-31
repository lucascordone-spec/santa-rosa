# Santa Rosa / FlashShift — B2B Partner Acquisition Agent (`@flashshift/partner-agent`)

Agente autónomo y suite de herramientas CLI para la prospección B2B, modelado financiero institucional y adquisición de volumen en **Base L2**. Diseñado específicamente para conectar con curadores de riesgo en Morpho Blue (**Steakhouse Financial**, **Re7 Capital**, **Gauntlet**), DAOs y gestores de tesorería (**Aerodrome Finance**, **Bware Labs**).

---

## 🎯 Misión del Agente

1. **Analizar los principales actores de deuda y liquidez en Base:** Mapear bóvedas MetaMorpho y billeteras de tesorería institucional con direcciones y métricas verificadas.
2. **Generar proyecciones matemáticas y financieras rigurosas:** Demostrar el beneficio mutuo entre el ahorro del **95%** para depositantes y la generación de ingresos pasivos on-chain mediante el **20% Builder Revenue Share** (5 bps).
3. **Proveer una CLI interactiva y automatizada (`npm run pitch`):** Conexión en vivo con el Gateway MCP público (`https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`), cálculo de cotizaciones determinísticas y redacción de propuestas institucionales para Foros de Gobernanza, Discord y Telegram.

---

## 📐 La Matemática del Modelo (Revenue Share 80/20)

FlashShift cobra una **tarifa plana de 0.25% (25 bps)** por rescates preventivos contra liquidaciones, sin costos ocultos de ejecución automática ni peajes de flash loans (Morpho Blue 0.00% fee):

```
┌────────────────────────────────────────────────────────────────────────┐
│             DISTRIBUCIÓN DE RESCATE FLASHSHIFT (0.25% TOTAL)           │
├────────────────────────────────────────────────────────────────────────┤
│ Total cobrado al usuario:                       0.25% (25 bps)         │
│                                                                        │
│   ├── Protocolo FlashShift (Tesorería):         0.20% (20 bps / 80%)   │
│   └── Curador / Builder (Referido):             0.05% (5 bps / 20%)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Comparativa frente a DeFi Saver y Liquidadores MEV:

| Métrica | Liquidación Forzada (MEV) | DeFi Saver | Santa Rosa / FlashShift | Ventaja del Curador |
|---|---|---|---|---|
| **Costo para el Usuario** | **5.00% a 10.00%** | **0.30%** (0.25% + 0.05%) | **0.25% (25 bps)** | **95% más barato** |
| **Costo Flash Loan** | N/A | Aave v3 (0.05% - 0.09%) | **Morpho Blue (0.00%)** | Capital gratis en el bloque |
| **Builder Revenue Share**| 0.00% | 0.00% (Retienen todo) | **0.05% (5 bps)** | **$500 por cada $1M operado** |
| **Slippage en Órdenes > $250k** | Crítico | Variable | **Chunking Router (-98%)** | Máxima retención de capital |

---

## 🏛️ Directorio de Curadores Institucionales Soportados

El agente cuenta con perfiles precargados con contratos verificados en Base Mainnet (Chain ID 8453):

- **Steakhouse Financial (`steakhouse`):** Curador de `steakUSDC` (`0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183`).
- **Re7 Capital (`re7`):** Curador de `Re7USDC` (`0x618495ccc4e751178c4914b1e939c0fe0fb07b9b`).
- **Gauntlet (`gauntlet`):** Curador cuantitativo de `gtUSDCp` (`0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0`).
- **Aerodrome Finance Treasury (`aerodrome`):** Multisig de Incentivos (`0xBDE0c70BdC242577c52dFAD53389F82fd149EA5a`) y Fondo de Bienes Públicos (`0x834C0DA026d5F933C2c18Fa9F8Ba7f1f792fDa52`).
- **Bware Labs (`bware`):** Infraestructura Blast API y tesorería de validadores.
- **B.Protocol & Block Analitica (`bprotocol`):** Curador de bóvedas insignia Flagship en Morpho.
- **Bóveda / Curador Personalizado (`custom`):** Admite cualquier dirección EVM en Base.

---

## 🚀 Uso Rápido

### 1. Compilación
```bash
npm run build
```

### 2. Modo Interactivo
```bash
npm run pitch
```
La CLI te guiará con un menú interactivo:
1. Selección del curador o DAO.
2. Ingreso del volumen mensual objetivo (ej. `50M` o `$25,000,000`).
3. Verificación de la billetera de referido.
4. Consulta en vivo al Gateway MCP público.
5. Renderizado de la proyección económica y las propuestas.

### 3. Modo Automatizado / Flags
```bash
# Proyección y propuesta completa para Steakhouse Financial ($50M/mes)
node dist/cli.js --curator steakhouse --volume 50M

# Proyección para Re7 Capital guardando el markdown de gobernanza
node dist/cli.js --curator re7 --volume 25M --format forum --output ./proposals

# Listar curadores disponibles
node dist/cli.js --list
```

---

## 🤖 Integración MCP (Model Context Protocol)

El Gateway MCP público permite a agentes en **Claude Desktop**, **Cursor**, **Coinbase AgentKit** o **ElizaOS** simular rescates y generar transacciones listas para firmar:

```json
{
  "mcpServers": {
    "santa-rosa": {
      "url": "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp",
      "headers": {
        "x-referral-wallet": "0xTuBilleteraDeCobro"
      }
    }
  }
}
```

### Ejemplo de Consulta Directa por cURL:
```bash
curl -X POST https://sunset-determining-budget-deluxe.trycloudflare.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "quote_debt_rescue",
      "arguments": {
        "borrowedAmountUsd": 5000000,
        "referralAddress": "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
      }
    }
  }'
```

---

## 🔒 Seguridad y Verificación On-Chain

- **Router en Base Mainnet:** `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`
- **Flash Loan Provider:** Morpho Blue (`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`)
- **No Custodial:** El contrato nunca almacena fondos de usuarios; todas las operaciones son atómicas (`revert` total si las invariantes de seguridad no se cumplen).
- **Reparto 100% On-Chain:** La división 80/20 se ejecuta en la misma transacción mediante `_distributeFee` en `FlashShiftRouter.sol`.
