# Templates de Outreach de Alto Impacto Técnico (Farcaster & X/Twitter)

Kit de comunicación técnica para distribución orgánica y adquisición de desarrolladores de agentes de IA, ballenas de DeFi y creadores en el ecosistema **Base L2**.

---

## 📐 Los Datos Matemáticos Inmutables (Cheat Sheet Técnico)

* **Router Deployed en Base Mainnet**: `0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`
* **Penalización estándar de liquidadores MEV**: **5.00%** del colateral incautado.
* **Comisión plana de rescate Santa Rosa**: **0.25%** (25 bps).
* **Multiplicador de ahorro para el usuario**: **20.0x más barato** (ahorro del 95% del costo de liquidación).
* **Flash Loan Fee**: **0.00%** vía Morpho Blue ($160M+ de liquidez instantánea en Base).
* **Builder Revenue Share**: **0.05% del volumen total (20% del fee del protocolo)** transferido en **USDC en el mismo bloque** de la transacción.
* **Costo promedio de gas en Base L2**: **< $0.05 USD** por rescate atómico completo.
* **Gateway MCP**: `https://sunset-determining-budget-deluxe.trycloudflare.com/mcp`

---

## 🟣 Farcaster Outreach Templates

### Canal 1: `/base`
**Enfoque**: Infraestructura nativa, bajo gas, economía de agentes autónomos y revenue sharing on-chain.

```text
Liquidations on Base shouldn't enrich predatory MEV bots at the expense of users.

When a borrower is liquidated on Morpho or Aave, external searchers extract a ~5.00% penalty ($5,000 on a $100k loan).

We just deployed the Santa Rosa Router on Base Mainnet (0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57):
⚡ 0.00% fee flash loans via Morpho Blue
🛡️ Atomic debt rescue at 0.25% flat fee (20x cheaper than liquidations)
⛽ Gas cost on Base: < $0.05 USD
💰 0.05% builder rev-share paid in USDC in the same block

Now accessible directly via MCP for AI agents, Cursor, and Claude Desktop.

Base is building the agent economy. Let's make sure agents protect liquidity instead of extracting it.

GitHub: https://github.com/lucascordone-spec/santa-rosa
MCP Gateway: https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
```

---

### Canal 2: `/ai-agents`
**Enfoque**: Monetización para desarrolladores de agentes, integraciones listas en AgentKit y ElizaOS, flujo de caja autónomo en USDC.

```text
Autonomous agents need sustainable on-chain revenue.

Instead of charging subscription tokens or spamming micropayments, we built a zero-friction revenue stream for AI agents on Base:

Integrate @santa-rosa MCP Server or native Coinbase AgentKit / ElizaOS action providers:
1. Your agent monitors lending positions on Base (HF < 1.05).
2. It executes an atomic flash loan debt rescue (0.00% fee Morpho).
3. The user saves ~95% vs an MEV liquidation penalty ($4,750 saved on $100k).
4. YOUR WALLET receives 0.05% of the rescued volume ($50.00 USDC on a $100k rescue) in the exact same block.

Code is 100% open-source:
• @coinbase/agentkit action provider included
• @elizaos/core plugin ready to plug
• 1-click install via Smithery: `npx @smithery/cli install @lucascordone-spec/santa-rosa --client cursor`

Start monetizing your agents today:
https://github.com/lucascordone-spec/santa-rosa
```

---

### Canal 3: `/degen`
**Enfoque**: Salvar posiciones apalancadas, no ser comida de bots MEV, matemáticas puras.

```text
Stop letting MEV liquidators eat 5% of your bags when markets wick down.

Math on a $100k borrowing position on Base:
❌ Liquidator penalty: -$5,000 USD
✅ Santa Rosa rescue: -$250 USD
💰 Cash kept in your pocket: +$4,750 USD

How it works:
1. 0% fee flash loan pays off your debt instantly
2. Safely unwinds a fraction of collateral
3. Restores your Health Factor to > 1.45 in 1 atomic tx
4. Total execution cost: 0.25% flat fee + $0.04 gas on Base.

If you run Claude or Cursor, you can test it gasless right now with our MCP:
https://sunset-determining-budget-deluxe.trycloudflare.com/mcp

Router Mainnet: 0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57
```

---

## 𝕏 / Twitter Outreach Templates

### Hilo Técnico Principal (Viral & Developer Centric - 6 Tweets)

#### Tweet 1 (Hook):
```text
DeFi liquidations are fundamentally broken. 

When a position is liquidated on Base, MEV bots seize a 5.00% penalty. That’s $5,000 stolen from a $100,000 position.

Today, we are open-sourcing Santa Rosa: an autonomous DeFi rescue router on Base L2 that saves borrowers ~95% of that penalty.

Here is the math & architecture 🧵👇
```

#### Tweet 2 (The Pure Math):
```text
2/ The Numbers:

Traditional Liquidation on $100,000 debt:
• Collateral seized: $105,000
• MEV bot profit: $5,000
• Net loss to user: $5,000

Santa Rosa Atomic Rescue:
• Flash loan repaid: $100,000
• Flat fee (0.25%): $250
• Net user savings: $4,750 (20.0x cheaper)
• Execution cost: < $0.05 on Base L2

No liquidation stigma. No bad debt.
```

#### Tweet 3 (The Flash Loan Engine):
```text
3/ How does it execute atomically without upfront capital?

We route through Morpho Blue’s 0.00% fee flash loan facility on Base ($160M+ liquidity).

In 1 atomic EVM transaction:
1. Flash-borrow debt token (e.g. USDC)
2. Repay debt & release collateral
3. Unwind exact collateral fraction via DEX routing
4. Repay flash loan & disburse fees
```

#### Tweet 4 (AI Agents & Model Context Protocol):
```text
4/ Autonomous AI Agents are the primary operators of Santa Rosa.

We deployed a full Model Context Protocol (MCP) Gateway on Base Mainnet.

Any agent running in @AnthropicAI Claude Desktop, @cursor_ai, Coinbase @AgentKit, or @elizaos can now inspect positions, run gasless simulations, and execute rescues with 0 custom Solidity.
```

#### Tweet 5 (Builder Revenue Share):
```text
5/ The Builder Revenue Share:

If you build an AI agent, bot, or frontend that routes rescues through Santa Rosa, you keep 20% of the protocol fee (0.05% of total volume).

Rescuing a $500k whale position pays $250.00 USDC directly to your developer address in the same block.

Real on-chain cash flow for agent builders.
```

#### Tweet 6 (CTA & Links):
```text
6/ Get started in 60 seconds:

📦 GitHub: https://github.com/lucascordone-spec/santa-rosa
⚡ MCP Gateway: https://sunset-determining-budget-deluxe.trycloudflare.com/mcp
📜 Base Router: 0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57

Install to Cursor / Claude in 1 command:
`npx @smithery/cli install @lucascordone-spec/santa-rosa --client claude`

Built for @base 🔵
```

---

### Direct Outreach Templates (DMs a Builders & Founders de Agentes)

#### Para Creadores de Agentes en Coinbase AgentKit:
```text
Hey [Name]! Saw your work on [Project/Agent]. We built an open-source Action Provider for @coinbase/agentkit on Base that allows your agent to earn 0.05% in USDC on every DeFi debt rescue it performs.

It uses Morpho Blue 0% flash loans and saves users 20x vs MEV liquidation penalties. Tested on Base Mainnet.

Drop-in TypeScript package is here: https://github.com/lucascordone-spec/santa-rosa/tree/main/packages/integrations/coinbase-agentkit

Would love your thoughts or help you plug your wallet to start collecting rev-share!
```

#### Para Creadores en ElizaOS:
```text
Hey [Name]! If you're running autonomous agents in ElizaOS, we just published `@santa-rosa/plugin-elizaos`. It gives your agent real-time Base L2 debt monitoring, 95% liquidation savings simulations, and instant 0.05% USDC rev-share payouts.

Takes 2 minutes to drop into `character.json`:
https://github.com/lucascordone-spec/santa-rosa/tree/main/packages/integrations/elizaos-plugin

Let me know if you want to test it on Base!
```
