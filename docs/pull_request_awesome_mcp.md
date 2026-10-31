# Pull Request Templates — Awesome MCP Servers & Official Directories

This document provides ready-to-use, copy-paste Pull Request submissions and directory registrations for the **Santa Rosa Protocol MCP Server**.

---

## 1. Pull Request for `punkpeye/awesome-mcp-servers`

* **Repository**: [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
* **Target File**: `README.md`
* **Target Section**: `### 💳 Finance & Fintech` or `### ⛓️ Blockchain & Web3`

### 📝 PR Title
```text
Add Santa Rosa Protocol - Base L2 DeFi Anti-Liquidation & 0% Flash Loans
```

### 📋 Git Commit Message
```text
feat: add Santa Rosa Protocol to Finance & Web3 MCP servers
```

### 🔄 Diff to Add in `README.md`
```markdown
- [Santa Rosa Protocol](https://github.com/lucascordone-spec/santa-rosa) 🧮 ☁️ - Headless DeFi infrastructure on Base L2. Provides AI agents with tools to scan debt positions, execute 0% fee Morpho Blue flash loans, save borrowers 95% vs MEV liquidation penalties, and earn an instant 0.05% builder revenue share in USDC in the same block.
```

### 📄 PR Description Body (Copy & Paste)
```markdown
### Summary

Adding **Santa Rosa Protocol**, an open-source, production-grade Model Context Protocol (MCP) server running on Base L2 (EVM ChainId 8453).

- **GitHub Repository**: https://github.com/lucascordone-spec/santa-rosa
- **Live MCP Endpoint**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
- **Verified Contract on BaseScan**: [`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`](https://basescan.org/address/0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
- **Smithery Package**: `@lucascordone-spec/santa-rosa`
- **License**: MIT

### Key Features for AI Agents:
- `get_user_debt_positions`: Scans active borrow/collateral positions across Morpho Blue & Aave v3 on Base.
- `simulate_rescue_savings`: Gasless mathematical simulation proving ~95% savings (20x cheaper) vs 5% MEV liquidation penalties.
- `quote_debt_rescue`: Computes 0.25% fee breakdown with 0.00% Morpho flash loan fee.
- `quote_leverage_multiply`: 1-click leverage multiply (3x-5x) with 0.10% fee.
- `build_rescue_transaction`: Generates ready-to-sign EVM calldata targeting the Base Mainnet Router.
- **Builder Revenue Share**: Instant **0.05% of volume** (20% of protocol fees) transferred directly to the agent developer's wallet in USDC in the exact same transaction block.

### Checklist
- [x] The tool is open-source and active.
- [x] Follows MCP specification (`2024-11-05`).
- [x] Added alphabetically or to the most relevant section (`Finance & Fintech`).
- [x] Endpoint verified and operational via `curl -X POST https://sunset-determining-budget-deluxe.trycloudflare.com/mcp -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`.
```

---

## 2. Pull Request for `modelcontextprotocol/servers` (Anthropic Official Directory)

* **Repository**: [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
* **Target File**: `README.md`
* **Target Section**: `### Community Servers` -> `Finance / Web3`

### 📝 PR Title
```text
feat(community): add Santa Rosa Protocol DeFi & Flash Loan MCP Server
```

### 🔄 Diff to Add in `README.md`
```markdown
- **[Santa Rosa Protocol](https://github.com/lucascordone-spec/santa-rosa)** - Non-custodial DeFi debt rescue, anti-liquidation protection, and 0% fee Morpho Blue flash loans on Base L2 with native builder rev-share.
```

### 📄 PR Description Body (Copy & Paste)
```markdown
### MCP Server Submission

**Server Name**: Santa Rosa Protocol (`santa-rosa-mcp`)
**Author / Organization**: Santa Rosa Protocol ([@lucascordone-spec](https://github.com/lucascordone-spec))
**Repository**: https://github.com/lucascordone-spec/santa-rosa
**Live Remote URL**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`
**Protocol Version**: `2024-11-05`
**Supported Transports**: Remote HTTP / JSON-RPC 2.0 (streamable via `mcp-remote`) & Stdio

### Description
Santa Rosa Protocol enables autonomous AI agents (Claude Desktop, Cursor, ElizaOS, Coinbase AgentKit) to interact with on-chain DeFi lending markets on Base L2. The server exposes tools to monitor collateralized debt positions, simulate capital preservation versus MEV liquidator penalties (saving ~95% of debt value), generate transaction calldata for atomic 0% fee Morpho Blue flash loans, and automatically distribute an on-chain 0.05% builder revenue share in USDC.

### Verification Command:
```bash
npx -y mcp-remote https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
```
```

---

## 3. Pull Request for `wong2/awesome-mcp-servers`

* **Repository**: [https://github.com/wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers)
* **Target Section**: `## Web3 & Crypto`

### 🔄 Diff:
```markdown
- [santa-rosa](https://github.com/lucascordone-spec/santa-rosa) - Autonomous DeFi debt rescue & 0% fee Morpho flash loans on Base L2 with 0.05% builder revenue share in USDC.
```

---

## 4. Smithery CLI 1-Click Verification

Users can install the server into their AI clients immediately:

```bash
# For Claude Desktop:
npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client claude

# For Cursor IDE:
npx -y @smithery/cli install @lucascordone-spec/santa-rosa --client cursor
```

---

## 5. Live Endpoint Verification Command

Run this command from any terminal to verify server status:

```bash
curl -X POST https://sunset-determining-budget-deluxe.trycloudflare.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

Expected response code: `HTTP 200 OK` with JSON containing 5 operational DeFi tools.
