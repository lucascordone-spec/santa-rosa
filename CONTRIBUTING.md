# Contributing to Santa Rosa Protocol

Thank you for your interest in contributing to **Santa Rosa Protocol**! ⚡

Santa Rosa is a non-custodial, headless DeFi infrastructure and Model Context Protocol (MCP) execution gateway on **Base L2 (ChainId: 8453)**. Our mission is to protect borrower capital against toxic MEV liquidations using 0% fee Morpho Blue flash loans while rewarding AI agent developers with an on-chain **0.05% builder revenue share** paid in USDC in the same block.

We welcome contributions from Web3 developers, AI agent researchers, smart contract engineers, and quant bot operators.

---

## 🏛️ Repository Architecture

The monorepo is structured as follows:

```text
santa-rosa/
├── .github/workflows/          # GitHub Actions CI & automated MCP healthcheck cron
├── contracts/                  # Foundry smart contracts suite
│   ├── src/                    # FlashShiftRouter.sol (Mainnet Router 0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57)
│   ├── test/                   # Unit & fork simulation test suites
│   └── foundry.toml            # Solidity 0.8.20 compiler & optimizer config (Cancun EVM)
├── packages/
│   ├── core/                   # Mathematical simulation, quote engine & viem bindings
│   ├── api/                    # Express REST API & telemetry stream
│   ├── mcp-server/             # Model Context Protocol JSON-RPC 2.0 server
│   ├── partner-agent/          # Automated B2B outreach & partner acquisition engine
│   ├── sentinel-keeper/        # Autonomous volume sentinel & liquidation keeper bot
│   └── integrations/
│       ├── claude-cursor/      # Claude Desktop & Cursor IDE configuration files
│       ├── coinbase-agentkit/  # Official Coinbase AgentKit Action Provider
│       └── elizaos-plugin/     # Official ElizaOS Plugin (@santa-rosa/plugin-elizaos)
└── docs/                       # PR templates, launch kits, and architecture deep dives
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: `v20.0.0` or higher (LTS recommended)
- **Foundry**: `forge` and `cast` installed ([foundry.paradigm.xyz](https://foundry.paradigm.xyz))
- **Git**: Latest version

### 1. Clone the Repository
```bash
git clone https://github.com/lucascordone-spec/santa-rosa.git
cd santa-rosa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build All Packages
```bash
npm run build
```

### 4. Run Smart Contract Tests (Foundry)
```bash
cd contracts
forge test --match-path test/FlashShiftRouter.t.sol -vvv
```

---

## 📐 Development Guidelines

### Smart Contracts (`contracts/`)
- **Solidity Version**: `0.8.20` targeting EVM `cancun`.
- **Non-Custodial Invariants**: The protocol **never** assumes custody of user funds beyond the single atomic transaction execution.
- **Reentrancy Protection**: All callbacks (`onMorphoFlashLoan`) must enforce strict caller validation (`require(msg.sender == MORPHO, UnauthorizedCallback())`).
- **Gas Optimization**: Strive for minimal bytecode size and minimal gas overhead per rescue/leverage cycle.
- **NatSpec**: All public and external functions must have comprehensive `@notice`, `@param`, and `@return` comments.
- **Testing**: Any modification to contract code must include Foundry tests validating state transitions, invariant maintenance, and revert conditions.

### MCP Server & TypeScript Packages (`packages/`)
- **TypeScript**: Strict type-checking enabled (`strict: true` in `tsconfig.json`).
- **Schema Validation**: All tool arguments must be strictly validated using **Zod**.
- **Error Handling**: Use JSON-RPC 2.0 standard error formats. Catch async exceptions and log diagnostic context.
- **Zero-Dependency Core**: `@santa-rosa/core` should remain lightweight, depending solely on `viem` and mathematical primitives.

---

## 🛠️ Adding a New MCP Tool

To expose a new capability to AI agents (Claude, Cursor, ElizaOS, Coinbase AgentKit):

1. **Implement Core Logic**: Add pure calculation or contract interaction function in `packages/core/src/`.
2. **Register Tool in MCP Server**: In `packages/mcp-server/src/index.ts`, define the tool name, description, Zod input schema, and handler.
3. **Add REST API Route**: In `packages/api/src/server.ts`, expose the corresponding HTTP endpoint for non-MCP callers.
4. **Update Integrations**: If applicable, expose the action in `@santa-rosa/agentkit-action-provider` and `@santa-rosa/plugin-elizaos`.
5. **Update Documentation**: Add the tool definition to `README.md` and `docs/guia_publicacion_directorios_mcp.md`.

---

## 🌿 Git Commit & Branching Standards

We follow the **Conventional Commits** specification:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | A new feature or MCP tool | `feat(mcp): add quote_concentrated_liquidity tool` |
| `fix:` | A bug fix | `fix(core): correct health factor precision for Aave v3` |
| `docs:` | Documentation changes | `docs: add Coinbase AgentKit tutorial` |
| `refactor:` | Code restructuring without behavior changes | `refactor(router): streamline Morpho callback decoding` |
| `test:` | Adding or improving tests | `test(contracts): add whale deleveraging invariant fuzzing` |
| `ci:` | GitHub Actions workflow updates | `ci: add automated gas profiling step` |

### Branch Naming
- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

---

## 📬 Pull Request Process

1. **Fork & Branch**: Create your feature branch from `main`.
2. **Run Tests & Builds**: Verify all contracts and TypeScript packages compile and pass tests:
   ```bash
   cd contracts && forge test --match-path test/FlashShiftRouter.t.sol
   cd .. && npm run build
   ```
3. **Commit**: Use concise, conventional commit messages.
4. **Open PR**: Submit your Pull Request targeting the `main` branch. Provide a clear summary of changes, rationale, and testing evidence.
5. **Review**: The core team will review your PR within 48 hours.

---

## 🔐 Reporting Security Vulnerabilities

Please **DO NOT** file public GitHub issues for security vulnerabilities. Review our [SECURITY.md](file:///c:/Users/Lucas/OneDrive/Escritorio/lcf/Nueva%20carpeta/SECURITY.md) for responsible disclosure guidelines.

---

## ⚖️ License
By contributing to Santa Rosa Protocol, you agree that your contributions will be licensed under the project's [MIT License](file:///c:/Users/Lucas/OneDrive/Escritorio/lcf/Nueva%20carpeta/LICENSE).
