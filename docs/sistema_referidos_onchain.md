# Sistema de Builder Revenue Share / Referidos On-Chain — FlashShift

> [!IMPORTANT]
> **El Concepto:** Un sistema de referidos en DeFi no puede ser manual ni depender de paneles web fuera de la cadena. Debe ser **100% on-chain, instantáneo y atómico**: en el mismo bloque en que se cobra la comisión del rescate o arbitraje, el contrato inteligente divide el pago y transfiere la tajada del desarrollador directamente a su billetera en USDC.

---

## 1. La Matemática del Revenue Share

Nuestra tarifa estándar de rescate o cierre es de **0.15% (15 bps)** sobre el volumen operado:

* **FlashShift (Protocolo):** 10 bps (**66.7%** del ingreso).
* **Builder / Referido (Desarrollador del Agente o Bot):** 5 bps (**33.3%** del ingreso).

### Ejemplo con números reales:
Si un bot o agente rescata o cierra una posición de **$5.000.000 USDC**:
* **Comisión total deducida en el bloque:** **$7.500 USDC**.
* **El Router divide en una sola línea de código:**
  - **$5.000 USDC** ➔ A la tesorería de FlashShift.
  - **$2.500 USDC** ➔ A la billetera del desarrollador/bot (`referralAddress`).

---

## 2. Implementación en el Smart Contract (`FlashShiftRouter.sol`)

En el contrato, cada función de ejecución (`rescue`, `close`, `migrate`, `swap`) acepta un parámetro opcional `address referral`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FlashShiftRouter {
    using SafeERC20 for IERC20;

    address public immutable protocolTreasury;
    uint256 public constant TOTAL_FEE_BPS = 15;      // 0.15%
    uint256 public constant BUILDER_SHARE_BPS = 5;    // 0.05% (33% del fee)
    uint256 public constant BPS_DENOMINATOR = 10000;

    constructor(address _treasury) {
        protocolTreasury = _treasury;
    }

    /// @notice Distribuye la comisión de forma atómica en el mismo bloque
    function _distributeFee(address token, uint256 totalFeeAmount, address referral) internal {
        if (referral != address(0) && referral != address(this)) {
            // Calcula la parte del builder (1/3 del fee)
            uint256 builderReward = (totalFeeAmount * BUILDER_SHARE_BPS) / TOTAL_FEE_BPS;
            uint256 protocolAmount = totalFeeAmount - builderReward;

            // Transfiere directamente en el bloque
            IERC20(token).safeTransfer(referral, builderReward);
            IERC20(token).safeTransfer(protocolTreasury, protocolAmount);
        } else {
            // Si no hay referido, el 100% va al protocolo
            IERC20(token).safeTransfer(protocolTreasury, totalFeeAmount);
        }
    }
}
```

---

## 3. Implementación en la Capa de Agentes y MCP

El desarrollador no tiene que lidiar con smart contracts complejos. En su configuración de agente o en las variables de entorno de su bot simplemente define su dirección:

### En el Servidor MCP (`@flashshift/mcp-server`):
```json
{
  "mcpServers": {
    "flashshift": {
      "command": "npx",
      "args": ["-y", "@flashshift/mcp-server"],
      "env": {
        "FLASHSHIFT_BUILDER_ADDRESS": "0xMiBilleteraParaCobrarComisiones"
      }
    }
  }
}
```

Cada vez que el agente llama a la herramienta:
```typescript
call_tool("flashshift_build_rescue_tx", {
  user: "0xPosicionEnRiesgo...",
  target_hf: 1.25,
  referral: process.env.FLASHSHIFT_BUILDER_ADDRESS // Inyectado automáticamente
})
```

El servidor MCP arma la `calldata` incluyendo la dirección del desarrollador en el parámetro `referral`. Cuando la transacción se ejecuta en Base, los dólares caen automáticamente en su cuenta.
