# Santa Rosa Protocol — Claude Desktop & Cursor MCP Integration

Zero-friction integration of the **Santa Rosa Protocol MCP Server** into **Claude Desktop** and **Cursor IDE**.

Allows developers, crypto researchers, and autonomous agents to scan DeFi positions on **Base L2**, simulate 20x cheaper anti-liquidation debt rescues, execute Morpho Blue 0% fee flash loans, and earn an instant **0.05% builder revenue share** directly into their wallet.

---

## ⚡ Method 1: 1-Click Install via Smithery CLI

### For Claude Desktop:
```bash
npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client claude
```

### For Cursor IDE:
```bash
npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client cursor
```

---

## 🛠️ Method 2: Manual Setup

### 1. Claude Desktop Setup

Locate your Claude Desktop configuration file:
* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
* **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the `santa-rosa` server configuration:

```json
{
  "mcpServers": {
    "santa-rosa": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"
      ],
      "env": {
        "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere"
      }
    }
  }
}
```

> **Note**: Replace `"0xYourBaseAddressHere"` with your own EVM wallet on Base L2 to automatically receive 0.05% of all rescued volume in USDC in the same block!

Restart Claude Desktop. You will see the hammer icon 🔨 with Santa Rosa's 5 tools ready to use.

---

### 2. Cursor IDE Setup

In your project root, create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "santa-rosa": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://sunset-determining-budget-deluxe.trycloudflare.com/mcp"
      ],
      "env": {
        "SANTA_ROSA_PARTNER_WALLET": "0xYourBaseAddressHere"
      }
    }
  }
}
```

Alternatively, go to **Cursor Settings > Features > MCP**, click **Add New MCP Server**:
* **Name**: `santa-rosa`
* **Type**: `command`
* **Command**: `npx -y mcp-remote https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`

---

## 💰 How You Earn Builder Revenue Share (0.05% in USDC)

* **Protocol Fee**: 0.25% flat fee on debt rescued.
* **Builder Revenue Share**: **0.05% of volume (20% of protocol fee)** transferred on-chain via `safeTransfer` in USDC in the same execution block on Base Mainnet.
* **Example**: Rescuing a $100,000 whale position earns you **$50.00 USDC** instantly, while saving the user **$4,750 USD** versus an external 5% liquidator penalty.

---

## 💬 Ready-to-Use Prompts for Claude & Cursor

Once installed, try asking Claude or Cursor Composer:

1. **Scan active borrow positions on Base**:
   > *"Revisa las posiciones de deuda en Base de la wallet `0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c`."*

2. **Simulate debt rescue savings vs MEV liquidation**:
   > *"Simula un rescate preventivo para una deuda de $100,000 con colateral de $105,000 en Morpho Blue. ¿Cuánto dinero ahorra el usuario y cuánto gano en rev-share?"*

3. **Generate transaction calldata**:
   > *"Genera la calldata para desapalancar $50,000 USDC en Morpho usando el Router de Santa Rosa en Base Mainnet."*

---

## 🔗 Official Protocol Info
* **Base Router Contract**: [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
* **MCP Remote Gateway**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
* **GitHub Repository**: [lucascordone-spec/santa-rosa](https://github.com/lucascordone-spec/santa-rosa)
