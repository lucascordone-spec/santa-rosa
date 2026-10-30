# Análisis de competencia — FlashShift (Base)

> [!NOTE]
> Fuente: búsqueda web del 29/10/2026. Los resúmenes de búsqueda pueden contener errores: **verificar tarifas y estado de cada servicio en sus sitios oficiales** antes de decidir precios.

---

## 1. Mapa rápido

| Servicio | Tipo | En Base | Cambio de colateral | Cambio de deuda | Migración entre protocolos | Automatización | Para agentes |
|---|---|---|---|---|---|---|---|
| **DeFi Saver** | Panel avanzado | ✅ | ✅ | ✅ | ✅ (Loan Shifter V2) | ✅ | ❌ |
| **Aave (adaptadores nativos)** | Función del protocolo | ✅ | ✅ | ✅ | ❌ (solo dentro de Aave) | ❌ | ❌ |
| **Morpho Bundler3** | Infraestructura | ✅ | Parcial | Parcial | ✅ solo **hacia** Morpho | ❌ | Vía SDK |
| **Summer.fi** | Panel | ⚠️ Cerró su app | — | — | — | — | — |
| **Instadapp** | Smart accounts | Limitado | — | — | — | — | — |
| **Giza ARMA** | Agente IA | ✅ | ❌ | ❌ | ❌ (mueve depósitos, no deuda) | ✅ | Es un agente |
| **Almanak** | Simulación para agentes | ✅ | — | — | — | — | Infraestructura |
| **HeyAnon** | Chat con intents | ✅ | Básico | Básico | ❌ | Parcial | Es un agente |
| **AgentKit (Coinbase)** | Kit de agentes | ✅ | ❌ | ❌ | ❌ | — | Tiene proveedores para Morpho y Moonwell, pero solo operaciones simples |

---

## 2. Competidor principal: DeFi Saver

Es el más parecido a lo que queremos hacer y **ya está en Base** con Aave v3, Compound y Morpho.

### Tarifas (según su documentación)
| Operación | Tarifa |
|---|---|
| Migrar entre protocolos **sin** cambiar activos | **0%** |
| Cambio de colateral o deuda (con swap) | **0.25%** |
| Swap entre stablecoins | 0.01% |
| Swap entre activos correlacionados (ETH ↔ wstETH) | 0.10% |
| Swap entre activos no correlacionados (ETH ↔ USDC) | 0.25% |
| Ejecución automática | +0.05% por ejecución |
| Monitoreo y configuración | Gratis |

### Debilidades / huecos
- Interfaz compleja, pensada para usuarios avanzados.
- **No está diseñado para agentes de IA** (sin MCP, sin x402, sin action provider de AgentKit).
- **Moonwell**, el protocolo de préstamo nativo de Base, no aparece en la cobertura reportada (verificar).
- Enfocado históricamente en Ethereum L1.

---

## 3. Aave: adaptadores nativos
- `ParaSwapDebtSwapAdapter` y swap de colateral, usando préstamos flash + ParaSwap.
- Disponibles en la interfaz oficial de Aave.
- **Límite:** solo funcionan **dentro de Aave**.

## 4. Morpho Bundler3
- Contratos abiertos, inmutables y auditados para agrupar operaciones.
- Adaptadores de migración desde Aave v2/v3, Compound v2/v3 → Morpho.
- **Límite:** solo migra **hacia** Morpho. Es infraestructura, no un producto con distribución.
- **Oportunidad:** usarlo como componente en lugar de competir con él.

## 5. Agentes de IA en Base
- **Giza ARMA:** optimiza rendimiento de stablecoins moviendo depósitos. **No gestiona deuda.**
- **Almanak:** simula estrategias antes de ejecutarlas. Puede ser un **socio** (cliente o integración).
- **HeyAnon:** interfaz en lenguaje natural; operaciones de préstamo básicas.
- **AgentKit:** tiene acciones simples para Morpho y Moonwell (depositar, pedir prestado), pero **no reestructuración atómica**.

---

## 6. Conclusiones clave

> [!IMPORTANT]
> **La migración simple ya es gratis en DeFi Saver.** No podemos cobrar por ella. Hay que cobrar por **swaps, automatización y la API para agentes**.

### Huecos de mercado
1. **Reestructuración de deuda para agentes:** nadie ofrece hoy una primitiva atómica y segura (MCP + AgentKit + x402) para que un agente cambie colateral, deuda o protocolo.
2. **Moonwell:** posible hueco de cobertura en el protocolo nativo de Base (verificar).
3. **Simplicidad:** DeFi Saver es para expertos; falta algo de 1 clic (mini app en Base App).
4. **Precio:** 0.25% en swaps no correlacionados es alto; hay margen para competir.

### Posicionamiento recomendado
> **"La capa de gestión de deuda para agentes de IA en Base."**
> Primero B2A (de negocio a agentes) y B2B, después usuarios finales.

### Precios sugeridos frente a DeFi Saver
| Operación | DeFi Saver | FlashShift (propuesta) |
|---|---|---|
| Migración pura | 0% | 0% (gancho) |
| Swap stablecoins | 0.01% | 0.01% |
| Swap correlacionados | 0.10% | 0.05% |
| Swap no correlacionados | 0.25% | 0.12% |
| Automatización | 0.05% | 0.03% o % del ahorro |
| API para agentes (x402) | — | US\$0.001–0.05 por llamada |

### Socios potenciales (en lugar de rivales)
- **Giza, HeyAnon, Almanak:** sus agentes podrían usar FlashShift como herramienta de deuda.
- **Morpho:** usar Bundler3 y postular a su programa de grants.
- **Coinbase / Base:** aportar un action provider a AgentKit y postular a Base Builder Grants.
