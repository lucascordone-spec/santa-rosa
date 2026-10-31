# Guía Maestra de Publicación en Directorios MCP

Esta guía operativa detalla paso a paso el proceso de registro e indexación del servidor MCP de **Santa Rosa Protocol** en los 5 principales directorios del ecosistema Model Context Protocol.

---

## 📋 Ficha Técnica Oficial del Servidor

Utiliza estos datos pre-aprobados para todos los formularios de registro:

| Campo | Valor Oficial |
| :--- | :--- |
| **Nombre del Servidor** | `santa-rosa-mcp` |
| **Display Name** | **Santa Rosa Protocol — DeFi Debt Rescue & Leverage on Base** |
| **Tagline (1 línea)** | *Autonomous DeFi debt protection & 0% fee Morpho flash loans on Base L2 with 80/20 on-chain builder rev-share.* |
| **Repositorio GitHub** | `https://github.com/lucascordone-spec/santa-rosa` |
| **Endpoint Público MCP** | `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp` |
| **Protocol Version** | `2024-11-05` |
| **Transport Type** | Remote HTTP / JSON-RPC 2.0 (Streamable over `mcp-remote`) y Stdio |
| **Router Contrato en Base** | `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57` (Mainnet ChainId 8453) |
| **Licencia** | MIT |
| **Categorías / Tags** | `defi`, `base`, `crypto`, `flash-loans`, `morpho-blue`, `finance`, `ethereum`, `autonomous-agents` |
| **Hook para Desarrolladores** | **0.05% de volumen (20% del fee del protocolo) pagado en USDC en el mismo bloque on-chain** |

---

## 1. Smithery.ai (Indexación y 1-Click Install)

[Smithery.ai](https://smithery.ai) es el catálogo de servidores MCP líder con soporte de instalación en un clic para Claude Desktop y Cursor.

### Requisitos previos cumplidos:
El archivo [`smithery.yaml`](file:///c:/Users/Lucas/OneDrive/Escritorio/lcf/Nueva%20carpeta/smithery.yaml) ya está creado y configurado en la raíz del repositorio.

### Paso a paso:
1. Navega a [https://smithery.ai/publish](https://smithery.ai/publish) (o inicia sesión con GitHub en Smithery).
2. Conecta tu cuenta de GitHub y haz clic en **"Submit a Server"**.
3. Ingresa la URL del repositorio:
   ```text
   https://github.com/lucascordone-spec/santa-rosa
   ```
4. Smithery detectará automáticamente el archivo `smithery.yaml` en la raíz.
5. Revisa la previsualización:
   - **Command**: `npx -y mcp-remote https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
   - **Config Schema**: Variable `partnerWallet` (permite a cada usuario ingresar su propia wallet de Base para cobrar el 0.05%).
6. Haz clic en **"Publish Server"**.
7. **Verificación local**:
   Una vez publicado, cualquier usuario del mundo puede instalarlo ejecutando en su terminal:
   ```bash
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client claude
   npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client cursor
   ```

---

## 2. Glama.ai (Catálogo de Herramientas y Servidores MCP)

[Glama.ai](https://glama.ai/mcp/servers) aloja una de las bases de datos de servidores MCP más curadas con métricas de uptime y latencia.

### Paso a paso:
1. Ingresa a [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers) y pulsa en **"Submit Server"** (botón superior derecho).
2. Completa los campos:
   - **Server Name**: `Santa Rosa Protocol`
   - **Repository URL**: `https://github.com/lucascordone-spec/santa-rosa`
   - **Public Endpoint / Remote URL**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
   - **Supported Transports**: `HTTP / SSE` & `Stdio`
   - **Description**:
     > Headless, non-custodial DeFi infrastructure on Base L2. Provides autonomous AI agents with tools to scan debt positions, calculate mathematical savings vs MEV liquidator penalties (saving ~95%), execute atomic debt rescues via 0.00% fee Morpho Blue flash loans, and earn an instant 0.05% builder revenue share in USDC.
   - **Primary Categories**: `DeFi`, `Web3`, `Finance`, `Developer Tools`.
3. Haz clic en **"Submit for Review"**. El bot de Glama ejecutará un ping de salud (`POST /mcp` con `method: "ping"` y `tools/list`) que responderá `200 OK` instantáneamente.

---

## 3. mcp.so (Directorio Abierto MCP)

[mcp.so](https://mcp.so) permite a desarrolladores explorar y agregar servidores con un formulario directo.

### Paso a paso:
1. Abre [https://mcp.so/submit](https://mcp.so/submit).
2. Autentícate con tu cuenta de GitHub.
3. Rellena los datos de integración:
   - **Title**: `Santa Rosa Protocol: Base L2 DeFi Rescue`
   - **GitHub Repo**: `https://github.com/lucascordone-spec/santa-rosa`
   - **Installation Command**:
     ```bash
     npx -y mcp-remote https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
     ```
   - **Tags**: `base`, `defi`, `morpho`, `flashloans`, `arbitrage`, `agents`
   - **Documentation URL**: `https://github.com/lucascordone-spec/santa-rosa#readme`
4. Pulsa **"Create Listing"**.

---

## 4. PulseMCP (Directorio y Monitoreo de Ecosistema)

[PulseMCP](https://pulsemcp.com) indexa servidores MCP remotos y comunitarios.

### Paso a paso:
1. Dirígete a [https://pulsemcp.com/add](https://pulsemcp.com/add).
2. Especifica:
   - **Name**: `Santa Rosa Protocol`
   - **Endpoint Type**: `Remote MCP Server`
   - **URL**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
   - **Network**: `Base Mainnet (8453)`
   - **Features**:
     - `get_user_debt_positions`: Morpho & Aave debt inspection.
     - `simulate_rescue_savings`: Gasless savings proof (20x cheaper).
     - `quote_debt_rescue`: 0.25% fee breakdown.
     - `quote_leverage_multiply`: 0.10% 1-click leverage.
     - `build_rescue_transaction`: Calldata for Base Router `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`.
3. Envía el formulario.

---

## 5. Awesome-MCP-Servers (GitHub Pull Request)

El repositorio [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) es la lista curated más vista de la comunidad MCP en GitHub.

### Plantilla de Pull Request:

1. Realiza un Fork del repositorio `punkpeye/awesome-mcp-servers`.
2. Crea una rama: `git checkout -b add-santa-rosa`.
3. Edita el archivo `README.md` bajo la sección **Finance & Crypto** o **DeFi**:

```markdown
- [Santa Rosa Protocol](https://github.com/lucascordone-spec/santa-rosa) - Headless DeFi debt rescue and 0% Morpho Blue flash loans on Base L2. Provides anti-liquidation protection (saving 95% vs MEV penalties) and instant 0.05% builder revenue share in USDC.
```

4. Haz commit y abre el Pull Request con los siguientes datos:

**Título del PR**:
```text
Add Santa Rosa Protocol - Base L2 DeFi Debt Rescue & Flash Loans
```

**Cuerpo del PR**:
```markdown
### Summary
Adding **Santa Rosa Protocol**, an open-source, production-grade Model Context Protocol (MCP) server running on Base L2 (EVM ChainId 8453).

- **Repository**: https://github.com/lucascordone-spec/santa-rosa
- **Remote Gateway**: https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
- **Base Router**: `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`
- **Features**:
  - `get_user_debt_positions`: Scans Morpho Blue and Aave v3 active positions.
  - `simulate_rescue_savings`: Proves ~95% savings (20x cheaper) vs 5% MEV liquidation penalties.
  - `quote_debt_rescue`: 0.25% fee with 0.00% Morpho flash loan.
  - `quote_leverage_multiply`: 0.10% 1-click leverage exposure.
  - `build_rescue_transaction`: Calldata generator for Base Mainnet.
  - **Builder Incentive**: Instant 0.05% volume revenue share (20% of protocol fees) sent in USDC in the same block to the agent developer.

Thank you!
```

---

## 📈 Verificación de Telemetría en Vivo

Cada vez que un crawler o usuario de estos directorios pruebe el servidor, la actividad se registrará en vivo en nuestro dashboard de operaciones:
* **Dashboard Web**: `https://sunset-determining-budget-deluxe.trycloudflare.com/`
* **JSON Stream**: `https://sunset-determining-budget-deluxe.trycloudflare.com/v1/telemetry`

Los eventos de descubrimiento (`INITIALIZE`, `TOOLS/LIST`, `PING`) y ejecuciones de agentes aparecerán en el stream en tiempo real con latencias inferiores a 50ms.
