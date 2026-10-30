# Auditoría Técnica y Arquitectura de Seguridad — FlashShift (Base)

> [!CAUTION]
> En DeFi y Flash Loans no hay segundas oportunidades. Un error de validación en un callback o una aprobación abierta permite el drenado instantáneo de fondos. Este documento define los **invariantes matemáticos de seguridad** que rigen cada contrato de FlashShift antes de escribir una sola línea de lógica de negocio.

---

## 1. Desglose del Contrato Morpho Blue (`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`)

Morpho Blue es un contrato *singleton* minimalista e inmutable. Para interactuar con él sin fallar ni dejar vectores de exploit, hay que entender 3 particularidades críticas de su código:

### A. Mecanismo de Repago de Flash Loan: Pull, NO Push
* **La trampa común:** En protocolos como Balancer o dYdX, devuelves el préstamo haciendo un `transfer()` manual a la bóveda.
* **En Morpho Blue:** Morpho ejecuta un `safeTransferFrom(msg.sender, address(this), assets)` **DESPUÉS** de que tu función `onMorphoFlashLoan` termina.
* **Invariante de Seguridad #1:** 
  Dentro del callback, el contrato debe ejecutar estrictamente:
  ```solidity
  IERC20(token).forceApprove(address(MORPHO), assets);
  ```
  Si se hace un transfer manual a Morpho, los fondos quedan atrapados y la transacción revierte porque Morpho volverá a intentar cobrar con `transferFrom`.

### B. Validación Estricta del Callback (`msg.sender`)
Cualquier contrato externo podría llamar a la función `onMorphoFlashLoan` fingiendo que es Morpho para forzar ejecuciones no deseadas o drenar aprobaciones.
* **Invariante de Seguridad #2:**
  ```solidity
  if (msg.sender != address(MORPHO)) revert UnauthorizedCallback();
  ```
  Debe ser la primera línea ejecutada sin excepción.

### C. Autorización de Posición sin Aprobación de Fondos (`setAuthorizationWithSig`)
¿Cómo puede FlashShift retirar colateral o repagar una posición a nombre del usuario sin que el usuario nos transfiera la propiedad de su cuenta?
* Morpho implementa:
  ```solidity
  mapping(address => mapping(address => bool)) public isAuthorized;
  ```
* **La Solución Segura:** El usuario firma un mensaje **EIP-712** (`setAuthorizationWithSig`) que nos autoriza **únicamente durante esa transacción** para modificar su posición. No dejamos aprobaciones infinitas guardadas en la blockchain.

---

## 2. Los 6 Vectores de Ataque y sus Mitigaciones en FlashShift

```
┌──────────────────────────────────────┬───────────────────────────────┬──────────────────────────────────────────┐
│ Vector de Ataque Potencial           │ Consecuencia si se Ignora     │ Mitigación Estricta en FlashShift        │
├──────────────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 1. Falsificación de Callback         │ Drenado de tokens intermedios │ `require(msg.sender == MORPHO)` inmutable│
│ 2. Reentrancia Cruzada (Cross-DEX)   │ Manipulación de balances      │ `ReentrancyGuardTransient` (EIP-1153)    │
│ 3. Slippage / Sandwich MEV           │ Pérdida en swap de colateral  │ Slippage estricto (`minAmountOut` EIP-712)│
│ 4. Residuo de Fondos en el Router    │ Tokens atrapados en contrato  │ Invariante: `balance == 0` al finalizar  │
│ 5. Autorizaciones Zombi Permanentes  │ Riesgo a futuro para usuario  │ Revocación automática o permisos nonceados│
│ 6. Degradación de Health Factor      │ Usuario queda peor que antes  │ Verificación: `HF_final >= targetHF`     │
└──────────────────────────────────────┴───────────────────────────────┴──────────────────────────────────────────┘
```

---

## 3. Manejo de Reversión Atómica y Estado Transitorio

Gracias a la máquina virtual de Ethereum (EVM) y a que Base soporta la actualización Dencun (EIP-1153 - Transient Storage):

1. **Almacenamiento Transitorio para el Contexto:**
   - Para no gastar gas escribiendo en storage persistente (`SSTORE`), los parámetros de la operación (`initiator`, `targetHF`, `referral`, `minProfit`) se guardan en **Transient Storage** durante el bloque.
2. **Reversión Garantizada:**
   - Si tras ejecutar el swap en Kyber o repagar la deuda, el colateral liberado no alcanza para pagar el préstamo + la comisión mínima esperada, el contrato ejecuta:
   ```solidity
   revert InsufficientOutputForRepayment();
   ```
   Esto cancela todo el bloque. El usuario solo gasta unos centavos de gas en Base y **su colateral y deuda quedan intactos**. Cero riesgo de pérdida de fondos.
