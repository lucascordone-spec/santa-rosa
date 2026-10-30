# NORMAS DE TRABAJO Y ALINEAMIENTO ESTRICTO — FLASHSHIFT

Este documento establece las **reglas inmutables de trabajo** que el agente DEBE leer, respetar y verificar antes de ejecutar cualquier acción, cálculo o desarrollo en este proyecto.

---

## 1. ¿QUÉ ES EL PROYECTO FLASHSHIFT? (Alcance Completo)

**FlashShift** es una infraestructura técnica y económica descentralizada, no custodial y headless (diseñada para bots, billeteras y agentes de IA autónomos) desplegada en la red **Base L2 (chainId 8453)**.

### Pilares Fundamentales (NO NEGOCIABLES):
1. **Flash Loan Provider Exclusivo:**  
   - Se toma **SIEMPRE en Morpho Blue a 0.00% de fee permanente**.  
   - Nunca pagar el 0.05% de Aave u otros protocolos.
2. **Protocolos de Préstamo Soportados en Base:**  
   - Operaciones atómicas tanto en **Morpho Blue** como en **Aave v3**.
3. **Servicios Oficiales:**
   - **Salvataje de Colateral / Rescate Anti-Liquidación:** Cancela la deuda con flash loan, libera el colateral atrapado, vende la fracción mínima y devuelve el colateral restante al usuario sin que este tenga que aportar efectivo de su bolsillo.
   - **Cierre Total de Posición sin Efectivo:** Salda el 100% de la deuda vendiendo colateral y devuelve el remanente en 1 solo bloque.
   - **Apalancamiento Atómico 1-Clic (*Multiply / Looping*):** Multiplica colateral (hasta 3x-5x) en 1 bloque vía Flash Loan + Swap + Depósito.
   - **Swaps Multiruta Optimizados:** Enrutamiento inteligente delegando en **KyberSwap Meta-Router** (Aerodrome, Uniswap v3, Curve, etc.).
4. **Modelo de Negocio y Revenue Share On-Chain (80/20):**
   - **Rescate y Cierre de Posición:** **0.25% fee total** (0.20% FlashShift / 0.05% directo a la wallet del Bot / Desarrollador / Billetera).
   - **Apalancamiento (*Multiply*):** **0.10% fee total** (0.08% FlashShift / 0.02% directo a la wallet del Bot / Desarrollador / Billetera).
   - **Swaps Spot:** **0.20% fee total** (0.16% FlashShift / 0.04% al bot).
   - **Moneda de Cobro:** Moneda líquida en el acto (USDC, WETH) en el mismo bloque mediante `safeTransfer`.
5. **Infraestructura Headless (Máquina a Máquina):**
   - API REST, MCP Server para IA y simulaciones `eth_call` **100% GRATUITAS**.

---

## 2. NORMAS DE TRABAJO OBLIGATORIAS (CUMPLIMIENTO ESTRICTO)

### NORMA 1: NO CAMBIAR NI ACHICAR EL PROYECTO
- Bajo ninguna circunstancia se puede recortar el alcance, eliminar servicios, simplificar artificialmente la arquitectura o cambiar los protocolos pactados.
- El proyecto debe mantener su nivel institucional y su visión completa en todo momento.

### NORMA 2: PRUEBAS RIGUROSAS Y CERO EXTRAPOLACIONES FALSAS
- **Queda estrictamente prohibido inventar datos, hacer suposiciones matemáticas lineales o asumir que la liquidez de un pool se multiplica mágicamente.**
- Cada número, tasa de slippage, health factor o métrica DEBE provenir de:
  1. Consultas crudas directas a la blockchain (RPC de Base L2 / Fork real).
  2. Respuestas exactas y no manipuladas de las APIs reales (KyberSwap, Morpho GraphQL, Chainlink).
- Si un par o un token no tiene liquidez suficiente (como ocurrió con USDe > $300k), se debe informar la **verdad cruda y técnica con los datos reales**, sin maquillar números.

### NORMA 3: CONSULTAR ANTES DE TOMAR DECISIONES
- Ante cualquier encrucijada técnica, cambio de arquitectura, limitación de mercado, diseño de contratos o estrategia económica:
  **SE DEBE CONSULTAR AL USUARIO PRIMERO.**
- No tomar decisiones unilaterales ni asumir el camino a seguir sin el consentimiento explícito del usuario.

### NORMA 4: COMPROMISO DE ALINEAMIENTO TOTAL
- El agente trabaja exclusivamente para ejecutar el proyecto con máxima excelencia técnica, seguridad criptográfica y precisión matemática, tal como el usuario lo requiere.
- El incumplimiento de estas normas atenta contra la supervivencia del proyecto.
