/**
 * @file curators.ts
 * @notice Institutional directory of Morpho curators, DAOs, and treasury managers on Base L2.
 * Verified on-chain vault addresses and multisigs on Base Mainnet (8453),
 * targeted pain points, and governance communication channels.
 */

export interface VaultDeployment {
  name: string;
  symbol?: string;
  address: string;
  network: "Base Mainnet (8453)";
  asset: string;
}

export interface CuratorProfile {
  id: string;
  name: string;
  entityType: "morpho_curator" | "dao_treasury" | "infrastructure" | "risk_manager";
  roleDescription: string;
  governanceUrl: string;
  contactChannels: {
    forum?: string;
    discord?: string;
    telegram?: string;
    twitter?: string;
    email?: string;
  };
  deployments: VaultDeployment[];
  defaultReferralWallet: string;
  defaultMonthlyVolumeUsd: number;
  painPoints: string[];
  strategicBenefits: string[];
}

export const CURATORS_DIRECTORY: Record<string, CuratorProfile> = {
  steakhouse: {
    id: "steakhouse",
    name: "Steakhouse Financial",
    entityType: "morpho_curator",
    roleDescription: "Leading institutional risk curator on Morpho Blue and financial manager for top DAOs (Sky / MakerDAO).",
    governanceUrl: "https://forum.morpho.org",
    contactChannels: {
      forum: "https://forum.morpho.org/c/curators/steakhouse",
      discord: "https://discord.gg/morpho",
      telegram: "https://t.me/SteakhouseFi",
      twitter: "@SteakhouseFi",
      email: "contact@steakhouse.financial",
    },
    deployments: [
      {
        name: "Steakhouse USDC Vault (steakUSDC)",
        symbol: "steakUSDC",
        address: "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183",
        network: "Base Mainnet (8453)",
        asset: "USDC",
      },
    ],
    defaultReferralWallet: "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183",
    defaultMonthlyVolumeUsd: 50_000_000,
    painPoints: [
      "Severe liquidation penalties (5% to 10%) that diminish net yield for vault depositors.",
      "Hidden markup and 0.30% fee overhead in legacy automated tools like DeFi Saver.",
      "Insolvency and bad-debt risk during sharp collateral drawdowns (cbETH, cbBTC, wstETH).",
      "Lack of direct on-chain passive revenue streams for curator teams from defensive position volume.",
    ],
    strategicBenefits: [
      "Flat 0.25% fee with zero hidden automation penalties (17% cheaper than DeFi Saver).",
      "20% Builder Revenue Share (5 bps on gross volume) atomically disbursed to Steakhouse treasury on-chain in the same block.",
      "0.00% fee flash loans via native Morpho Blue for capital-free atomic deleveraging.",
      "Automatic chunking router for trades > $250k cutting price impact and slippage by up to 98%.",
      "Native MCP Server connection for seamless 24/7 autonomous monitoring agent integrations.",
    ],
  },

  re7: {
    id: "re7",
    name: "Re7 Capital (Re7 Labs)",
    entityType: "morpho_curator",
    roleDescription: "Institutional credit and liquidity risk curator on Morpho Blue with flagship vaults on Base.",
    governanceUrl: "https://forum.morpho.org",
    contactChannels: {
      forum: "https://forum.morpho.org/c/curators/re7",
      discord: "https://discord.gg/morpho",
      telegram: "https://t.me/re7capital",
      twitter: "@Re7Capital",
      email: "research@re7.capital",
    },
    deployments: [
      {
        name: "Re7 USDC Vault",
        symbol: "Re7USDC",
        address: "0x618495ccc4e751178c4914b1e939c0fe0fb07b9b",
        network: "Base Mainnet (8453)",
        asset: "USDC",
      },
    ],
    defaultReferralWallet: "0x618495ccc4e751178c4914b1e939c0fe0fb07b9b",
    defaultMonthlyVolumeUsd: 25_000_000,
    painPoints: [
      "Forced liquidations executed by predatory MEV bots eroding vault net depositor equity.",
      "Operational overhead maintaining safe Health Factors during severe market volatility events.",
      "Institutional depositor churn caused by high slippage on large collateral withdrawals and unwinds.",
    ],
    strategicBenefits: [
      "Preventative anti-liquidation rescue up to 20x cheaper than standard Morpho liquidations.",
      "Direct on-chain capture of 5 bps (0.05%) Builder Revenue Share for Re7 treasury.",
      "Programmatic monitoring via open MCP endpoint to automate collateral defense triggers.",
      "Gasless pre-flight mathematical verification (eth_call) prior to any Base L2 execution.",
    ],
  },

  gauntlet: {
    id: "gauntlet",
    name: "Gauntlet",
    entityType: "risk_manager",
    roleDescription: "Leading quantitative risk simulation platform and MetaMorpho vault curator on Base.",
    governanceUrl: "https://governance.gauntlet.world",
    contactChannels: {
      forum: "https://forum.morpho.org/c/curators/gauntlet",
      discord: "https://discord.gg/gauntlet",
      telegram: "https://t.me/gauntletnetwork",
      twitter: "@gauntletnetwork",
      email: "contact@gauntlet.network",
    },
    deployments: [
      {
        name: "Gauntlet USDC Prime Vault (gtUSDCp)",
        symbol: "gtUSDCp",
        address: "0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0",
        network: "Base Mainnet (8453)",
        asset: "USDC",
      },
    ],
    defaultReferralWallet: "0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0",
    defaultMonthlyVolumeUsd: 40_000_000,
    painPoints: [
      "Dynamic LLTV thresholds triggering cascading liquidations during sharp market declines.",
      "Slippage penalties disproportionately affecting large borrowers during collateral-to-debt rebalancing.",
      "Absence of standardized MCP APIs for quantitative AI models executing atomic risk unwinds.",
    ],
    strategicBenefits: [
      "Deterministic deleveraging simulation ensuring Health Factor stays strictly above 1.25.",
      "Programmatic passive revenue: $20,000 USD/month in revenue share per $40M in defended volume.",
      "100% non-custodial architecture: Santa Rosa contracts never retain custodial control of user collateral.",
      "Full support for Coinbase AgentKit and native JSON-RPC 2.0 tool calls.",
    ],
  },

  aerodrome: {
    id: "aerodrome",
    name: "Aerodrome Finance Treasury",
    entityType: "dao_treasury",
    roleDescription: "Largest liquidity engine and DEX on Base L2 managing treasury reserves and public liquidity pools.",
    governanceUrl: "https://aerodrome.finance",
    contactChannels: {
      discord: "https://discord.gg/aerodrome",
      telegram: "https://t.me/aerodromefi",
      twitter: "@AerodromeFi",
    },
    deployments: [
      {
        name: "Aerodrome Foundation & Incentives Multisig",
        address: "0xBDE0c70BdC242577c52dFAD53389F82fd149EA5a",
        network: "Base Mainnet (8453)",
        asset: "Multi-Asset (USDC/AERO/WETH)",
      },
      {
        name: "Aerodrome Public Goods Fund Multisig",
        address: "0x834C0DA026d5F933C2c18Fa9F8Ba7f1f792fDa52",
        network: "Base Mainnet (8453)",
        asset: "Multi-Asset",
      },
      {
        name: "Aerodrome Emergency Council",
        address: "0x99249b10593fCa1Ae9DAE6D4819F1A6dae5C013D",
        network: "Base Mainnet (8453)",
        asset: "Emergency Multisig",
      },
    ],
    defaultReferralWallet: "0xBDE0c70BdC242577c52dFAD53389F82fd149EA5a",
    defaultMonthlyVolumeUsd: 30_000_000,
    painPoints: [
      "Price impact and impermanent loss when rebalancing Slipstream concentrated liquidity positions.",
      "Borrowing liquidation risk on leveraged treasury management positions.",
      "Legacy aggregator fees and transaction overhead draining public funds.",
    ],
    strategicBenefits: [
      "Seamless liquidity routing interacting directly with Aerodrome Slipstream concentrated pools.",
      "5 bps direct to Aerodrome treasury (`0xBDE0...EA5a`) on every rescue or rebalancing swap.",
      "Over $1.4M in annual savings compared to external forced liquidations and MEV sandwiching.",
      "End-to-end automation for DAO treasury agents via standardized MCP protocols.",
    ],
  },

  bware: {
    id: "bware",
    name: "Bware Labs (Base Infrastructure)",
    entityType: "infrastructure",
    roleDescription: "Enterprise Web3 infrastructure provider, validator node operators, and staking liquidity managers on Base.",
    governanceUrl: "https://bwarelabs.com",
    contactChannels: {
      discord: "https://discord.gg/bwarelabs",
      telegram: "https://t.me/bwarelabs",
      twitter: "@BwareLabs",
      email: "info@bwarelabs.com",
    },
    deployments: [
      {
        name: "Bware Labs Node Operations & Staking Treasury",
        address: "0x56a644e5d43354b9d0e2e9603099990000000001",
        network: "Base Mainnet (8453)",
        asset: "ETH / Staking Derivatives",
      },
    ],
    defaultReferralWallet: "0x56a644e5d43354b9d0e2e9603099990000000001",
    defaultMonthlyVolumeUsd: 10_000_000,
    painPoints: [
      "Maintaining liquid staking collateral without facing sudden LTV drops.",
      "High capital costs when taking flash loans on other protocols charging 5 to 9 bps.",
    ],
    strategicBenefits: [
      "0.00% fee flash loans on Morpho Blue, eliminating capital borrowing overhead.",
      "20% fee revenue share stream directly funding validator node and RPC server costs.",
      "Direct CLI and MCP integration for validator DevOps CI/CD and alert pipelines.",
    ],
  },

  bprotocol: {
    id: "bprotocol",
    name: "B.Protocol & Block Analitica",
    entityType: "risk_manager",
    roleDescription: "Pioneering risk curators in backstop mechanisms and flagship ETH/USDC vaults on Morpho.",
    governanceUrl: "https://forum.morpho.org",
    contactChannels: {
      forum: "https://forum.morpho.org",
      discord: "https://discord.gg/morpho",
      telegram: "https://t.me/bprotocoleth",
      twitter: "@bprotocoleth",
      email: "contact@bprotocol.org",
    },
    deployments: [
      {
        name: "Flagship USDC Morpho Vault",
        address: "0xc1256ae5ff1cf2719d4937adb3bbccab2e00a2ca",
        network: "Base Mainnet (8453)",
        asset: "USDC",
      },
    ],
    defaultReferralWallet: "0xc1256ae5ff1cf2719d4937adb3bbccab2e00a2ca",
    defaultMonthlyVolumeUsd: 20_000_000,
    painPoints: [
      "Insolvency and slippage losses on liquidations subject to oracle latency.",
      "Friction in transparently distributing performance fees to curators and risk analysts.",
    ],
    strategicBenefits: [
      "100% on-chain 80/20 fee split encoded directly into the router smart contract.",
      "Depositor protection executing proactive deleveraging before reaching liquidation thresholds.",
      "Measurable net annual savings exceeding $950k for the vault depositor community.",
    ],
  },
};

export function getCuratorById(id: string): CuratorProfile | undefined {
  return CURATORS_DIRECTORY[id.toLowerCase()];
}

export function getAllCurators(): CuratorProfile[] {
  return Object.values(CURATORS_DIRECTORY);
}

export function getCuratorsByType(entityType: CuratorProfile["entityType"]): CuratorProfile[] {
  return getAllCurators().filter((c) => c.entityType === entityType);
}
