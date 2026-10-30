# 🤝 Guía de Integración para Partners — Santa Rosa Protocol

> **Ganá el 0.05% (5 bps) del volumen en USDC transferido a tu wallet en el mismo bloque por el contrato inteligente en Base L2.**

---

## 💡 La Oportunidad para Desarrolladores y Bots

Si operás:
* Un **Bot de Alertas en Telegram** (monitoreo de Health Factor en Aave o Morpho).
* Un **Agente Autónomo de IA** (Coinbase AgentKit, ElizaOS, Virtuals).
* Una **Billetera Web3** o **Gestor de Carteras** en Base.

Actualmente, cuando un usuario o bóveda entra en riesgo de liquidación, los liquidadores de MEV le cobran un **5% a 10% de penalización**, y tu bot no gana nada.

Con **Santa Rosa**:
1. **Tu usuario se ahorra el ~95% del castigo** pagando solo 0.25% de tarifa plana.
2. **Tu bot recibe el 0.05% de la deuda rescatada en USDC directo a tu wallet en el mismo bloque**.
3. **Cero custodia, cero facturación mensual:** El contrato `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` ejecuta la transferencia automáticamente (`safeTransfer`).

---

## 🛠️ Cómo Integrar en 3 Minutos

### Vía 1: Integración con Agentes de IA (MCP Protocol)

#### A. Conexión Remota Inmediata (Sin instalar código):
Agregá el endpoint público con túnel SSL a tu cliente MCP (Cursor, Windsurf, Claude Desktop, o frameworks de agentes):

```json
{
  "mcpServers": {
    "santa-rosa": {
      "url": "https://rates-counter-breed-frontier.trycloudflare.com/mcp"
    }
  }
}
```

#### B. Conexión Local Stdio:
```json
{
  "mcpServers": {
    "santa-rosa": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "env": {
        "SANTA_ROSA_PARTNER_WALLET": "0xTU_BILLETERA_DE_COBRO"
      }
    }
  }
}
```

El agente ahora tiene acceso nativo a:
* `get_user_debt_positions`: Escaneo de deudas en Base.
* `simulate_rescue_savings`: Simulación de cuánto dinero se ahorra el usuario y cuánto cobra tu agente.
* `build_rescue_transaction`: Calldata empaquetada lista para firmar.

---

### Vía 2: Integración para Bots de Telegram y Keepers (REST API)

Cuando tu bot detecta una alerta de riesgo (`Health Factor < 1.05`), consulta a la API de Santa Rosa:

#### 1. Simular Ahorro (Gasless `eth_call`)
```bash
# Podés consultar al endpoint público o a tu instancia local:
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/simulate/rescue \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c",
    "currentDebtUsd": 41227.81,
    "currentCollateralUsd": 42536.10,
    "debtToRepayUsd": 41227.81,
    "referralAddress": "0xTU_BILLETERA_PARTNER"
  }'
```

**Respuesta recibida por tu bot:**
```json
{
  "summary": "Ahorro neto garantizado para el usuario: $1.958,32 USD evitando liquidación forzada.",
  "simulation": {
    "financialComparison": {
      "liquidationPenaltyIfLiquidatedUsd": 2061.39,
      "flashShiftFeeUsd": 103.07,
      "builderFeeUsd": 20.61,
      "protocolFeeUsd": 82.46,
      "netMoneySavedUsd": 1958.32
    }
  }
}
```

#### 2. Mensaje Inline para el Usuario en Telegram:
Tu bot ahora puede mostrar:
> ⚠️ **¡Alerta de Liquidación!** Tu posición en Morpho tiene HF 1.0006.  
> Si te liquidan, perderás **\$2,061 USD**.  
> [ 🛡️ Rescatar con Santa Rosa (Ahorrás \$1,958 USD) ]

Al hacer clic, el bot solicita la transacción en `/v1/build-tx`, el usuario firma, y tu wallet recibe **\$20.61 USDC** al instante en Base.

---

## 📍 Datos de Red en Base L2 (ChainId: 8453)

* **Router Contract:** `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`
* **Morpho Blue Flash Loan (0% Fee):** `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`
* **USDC Token:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
* **Gas promedio por rescate:** `< $0.05 USD`
