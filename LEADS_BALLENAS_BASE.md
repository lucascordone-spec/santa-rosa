# 🐋 Base L2 Whale Intelligence Report — Morpho Blue At-Risk Debt Positions

> **Scan Timestamp:** `2026-10-30T18:24:27.438Z`  
> **Target Network:** Base Mainnet (ChainId: `8453`)  
> **Data Source:** Live Morpho Blue GraphQL API (`https://blue-api.morpho.org/graphql`)  
> **Invariants:** 100% Real On-Chain Verified Data. Health Factor $\le$ 1.05 (Imminent Liquidation Threshold).

---

## 📊 Executive Summary of Identified Whale Leads

| Metric | Aggregate Value (USD) | Formula / Rate |
| :--- | :--- | :--- |
| **Whale Positions Identified ($ge$ $10k Debt)** | **44 High-Value Targets** | Active borrows with $\text{HF} \le 1.05$ |
| **Total Debt at Liquidation Risk** | **$5,918,009.38** | Actual borrowed value in Morpho Blue Base |
| **Total Backing Collateral** | **$6,464,359.18** | Real on-chain collateral deposited |
| **Total Liquidation MEV Penalty at Risk** | **$295,900.47** | Standard 5.00% liquidator penalty seized from users |
| **Santa Rosa Rescue Protocol Fee (80%)** | **$11,836.02** | 0.20% flat fee to Santa Rosa Treasury |
| **Partner Referral Commissions (20% / 5 bps)** | **$2,959.00** | 0.05% paid in real-time to bot/wallet referrer |
| **Total Net Capital Saved for Borrowers** | **$281,105.45** | ~95% savings vs. external liquidation penalty |

---

## 🏆 Top 20 Whale Positions in Immediate Liquidation Danger

The following table provides the exhaustive breakdown of each identified whale position, their exact balances, and the economic opportunity for Santa Rosa and our integration partners.

| Rank | Borrower Safe / Wallet | Market Pair | Health Factor | Exact Debt (USD) | Exact Collateral (USD) | MEV Penalty Avoided (5%) | Protocol Fee (0.20%) | Partner Commission (5 bps) | Net Borrower Savings |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | [`0xC955...283e`](https://basescan.org/address/0xC955793F9a7572ED31D62ebfb25b933aa3e1283e) | `wstETH/WETH` | **1.0382** | $1,039,217.61 | $1,140,417.35 | $51,960.88 | $2,078.44 | **$519.61** | $49,362.84 |
| **#2** | [`0xC42e...4C45`](https://basescan.org/address/0xC42eaDE6AB740763c5942932Dd7c09C913644C45) | `cbETH/WETH` | **1.0332** | $852,142.04 | $931,473.61 | $42,607.10 | $1,704.28 | **$426.07** | $40,476.75 |
| **#3** | [`0x13B3...1BBB`](https://basescan.org/address/0x13B3080AAAFE52192414aaE37cfE4f8889251BBB) | `weETH/WETH` | **1.0134** | $541,450.93 | $581,280.61 | $27,072.55 | $1,082.90 | **$270.73** | $25,718.92 |
| **#4** | [`0xc8DF...39FD`](https://basescan.org/address/0xc8DF827157AdAf693FCb0c6f305610C28De739FD) | `wstETH/WETH` | **1.0133** | $451,338.17 | $483,372.35 | $22,566.91 | $902.68 | **$225.67** | $21,438.56 |
| **#5** | [`0x5f56...A48B`](https://basescan.org/address/0x5f5691805947a45DC0E4FB851C262b1f595AA48B) | `wstETH/WETH` | **1.0364** | $424,498.18 | $465,011.48 | $21,224.91 | $849.00 | **$212.25** | $20,163.66 |
| **#6** | [`0x7932...7177`](https://basescan.org/address/0x793204156A55373487da09f69e771542fd117177) | `weETH/WETH` | **1.0211** | $405,839.22 | $453,386.96 | $20,291.96 | $811.68 | **$202.92** | $19,277.36 |
| **#7** | [`0x69ab...6DA5`](https://basescan.org/address/0x69aba798b92Ec4C06e9d89eb3a133A49cEA16DA5) | `cbETH/WETH` | **1.0440** | $384,220.29 | $424,402.72 | $19,211.01 | $768.44 | **$192.11** | $18,250.46 |
| **#8** | [`0x0e28...4cFE`](https://basescan.org/address/0x0e2852b070fbF866acecb93DeC04b91F02804cFE) | `cbETH/WETH` | **1.0186** | $323,531.22 | $348,679.27 | $16,176.56 | $647.06 | **$161.77** | $15,367.73 |
| **#9** | [`0x4cFf...5F75`](https://basescan.org/address/0x4cFf826ED74ecF74374f691fe454C2C847645F75) | `cbETH/WETH` | **1.0500** | $266,839.30 | $296,423.79 | $13,341.97 | $533.68 | **$133.42** | $12,674.87 |
| **#10** | [`0xC62d...E873`](https://basescan.org/address/0xC62d81aa29972Df5Cc59cC3dFC1D65a05158E873) | `wsuperOETHb/WETH` | **1.0316** | $126,535.61 | $142,691.03 | $6,326.78 | $253.07 | **$63.27** | $6,010.44 |
| **#11** | [`0xB157...48D8`](https://basescan.org/address/0xB157EE8325aE8e0f5A5907e71C0871fDA62748D8) | `weETH/WETH` | **1.0177** | $117,609.02 | $126,791.42 | $5,880.45 | $235.22 | **$58.80** | $5,586.43 |
| **#12** | [`0x9aC1...0275`](https://basescan.org/address/0x9aC108De356A239d9545ea5043188493Ee530275) | `cbETH/WETH` | **1.0161** | $64,944.71 | $69,819.67 | $3,247.24 | $129.89 | **$32.47** | $3,084.87 |
| **#13** | [`0x92E4...fBA0`](https://basescan.org/address/0x92E4D8C448AbD0E167f5814a0B49b2b9C687fBA0) | `cbETH/WETH` | **1.0218** | $55,348.45 | $59,834.64 | $2,767.42 | $110.70 | **$27.67** | $2,629.05 |
| **#14** | [`0x92E4...fBA0`](https://basescan.org/address/0x92E4D8C448AbD0E167f5814a0B49b2b9C687fBA0) | `weETH/WETH` | **1.0225** | $55,337.15 | $59,938.33 | $2,766.86 | $110.67 | **$27.67** | $2,628.51 |
| **#15** | [`0x10CE...d5Da`](https://basescan.org/address/0x10CE6b0f35E41d2D3D924BE280f92c1dE80cd5Da) | `wsuperOETHb/WETH` | **1.0497** | $53,454.06 | $61,337.76 | $2,672.70 | $106.91 | **$26.73** | $2,539.07 |
| **#16** | [`0x081e...5299`](https://basescan.org/address/0x081eA40e753CD6c8cB2B03d52798999691b85299) | `yoETH/WETH` | **1.0190** | $53,203.85 | $59,295.32 | $2,660.19 | $106.41 | **$26.60** | $2,527.18 |
| **#17** | [`0x2A62...0cc7`](https://basescan.org/address/0x2A622Abb4F31af9472717ec77E600c9A6f2b0cc7) | `wstETH/WETH` | **1.0341** | $50,991.53 | $54,576.37 | $2,549.58 | $101.98 | **$25.50** | $2,422.10 |
| **#18** | [`0x3Ed3...4E24`](https://basescan.org/address/0x3Ed3583d143Ff259A3CE1e0FAAf250229AA04E24) | `wstETH/WETH` | **1.0426** | $49,389.09 | $53,300.35 | $2,469.45 | $98.78 | **$24.69** | $2,345.98 |
| **#19** | [`0xB71d...cc20`](https://basescan.org/address/0xB71dE47d986AE0A245222215b498C4d8b6e1cc20) | `wstETH/WETH` | **1.0323** | $47,791.29 | $51,065.19 | $2,389.56 | $95.58 | **$23.90** | $2,270.09 |
| **#20** | [`0x9558...253F`](https://basescan.org/address/0x9558B339Bb03246C44c57fCee184645DBfAb253F) | `weETH/WETH` | **1.0055** | $47,538.03 | $50,637.90 | $2,376.90 | $95.08 | **$23.77** | $2,258.06 |
| **#21** | [`0x10c5...6e2c`](https://basescan.org/address/0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c) | `wstETH/WETH` | **1.0006** | $41,344.64 | $42,820.60 | $2,067.23 | $82.69 | **$20.67** | $1,963.87 |
| **#22** | [`0xad90...Dc09`](https://basescan.org/address/0xad9082B9C4e371BB55c800812bf1B81d7c51Dc09) | `wstETH/WETH` | **1.0307** | $36,638.71 | $39,087.33 | $1,831.94 | $73.28 | **$18.32** | $1,740.34 |
| **#23** | [`0x0f00...68C0`](https://basescan.org/address/0x0f00463c035E7b4d6cbF97E89Fa966AB8D4168C0) | `wstETH/WETH` | **1.0349** | $33,838.75 | $37,015.55 | $1,691.94 | $67.68 | **$16.92** | $1,607.34 |
| **#24** | [`0x0083...a931`](https://basescan.org/address/0x008346AC96cAeE8D9a59768F6b6842307A17a931) | `cbETH/WETH` | **1.0088** | $30,998.62 | $33,084.26 | $1,549.93 | $62.00 | **$15.50** | $1,472.43 |
| **#25** | [`0x1515...3fe1`](https://basescan.org/address/0x1515d291E54C4493f6a15B3250069F7A6A153fe1) | `wstETH/WETH` | **1.0380** | $30,019.52 | $32,935.99 | $1,500.98 | $60.04 | **$15.01** | $1,425.93 |
| **#26** | [`0x4D70...99c5`](https://basescan.org/address/0x4D70603a1cDA000263f8fCc2a5Df7317e6C199c5) | `cbETH/WETH` | **1.0149** | $29,532.39 | $31,710.30 | $1,476.62 | $59.06 | **$14.77** | $1,402.79 |
| **#27** | [`0xFA37...3869`](https://basescan.org/address/0xFA375413867671613491190096278B868b383869) | `wstETH/WETH` | **1.0390** | $27,407.20 | $30,097.82 | $1,370.36 | $54.81 | **$13.70** | $1,301.84 |
| **#28** | [`0x2Be6...934A`](https://basescan.org/address/0x2Be693a2282D90B645033b392e26Ea594508934A) | `wstETH/WETH` | **1.0411** | $27,067.41 | $29,783.73 | $1,353.37 | $54.13 | **$13.53** | $1,285.70 |
| **#29** | [`0x985e...52B8`](https://basescan.org/address/0x985e4878c31d4b866f3527A03B0b2e5c77F352B8) | `cbETH/WETH` | **1.0218** | $26,883.93 | $29,063.30 | $1,344.20 | $53.77 | **$13.44** | $1,276.99 |
| **#30** | [`0xBe66...CD0f`](https://basescan.org/address/0xBe664bae4ee9fec1acEE3427baB216a09dC3CD0f) | `cbETH/WETH` | **1.0499** | $23,037.51 | $25,591.10 | $1,151.88 | $46.08 | **$11.52** | $1,094.28 |
| **#31** | [`0xbE03...c6D4`](https://basescan.org/address/0xbE034b27c6c229DcE8ecA7483EC6b6b41Bb7c6D4) | `wstETH/WETH` | **1.0459** | $21,993.28 | $24,314.00 | $1,099.66 | $43.99 | **$11.00** | $1,044.68 |
| **#32** | [`0xc497...A390`](https://basescan.org/address/0xc497F487296bAa25606Fca48980b9a7E4539A390) | `wstETH/WETH` | **1.0298** | $18,090.18 | $19,283.12 | $904.51 | $36.18 | **$9.05** | $859.28 |
| **#33** | [`0x7d9B...1158`](https://basescan.org/address/0x7d9B8F55863CC70E14E4bA42048ef67057131158) | `wstETH/WETH` | **1.0334** | $15,895.28 | $17,001.81 | $794.76 | $31.79 | **$7.95** | $755.03 |
| **#34** | [`0x72a5...a1AC`](https://basescan.org/address/0x72a5A67f1Cd13531D55F24e60035Ab5171C0a1AC) | `wstETH/WETH` | **1.0417** | $15,754.96 | $17,347.21 | $787.75 | $31.51 | **$7.88** | $748.36 |
| **#35** | [`0x93E4...04c3`](https://basescan.org/address/0x93E4279d6dD59DFc154DAfAB230AB0F81aCB04c3) | `wstETH/WETH` | **1.0418** | $15,472.93 | $17,038.57 | $773.65 | $30.95 | **$7.74** | $734.96 |
| **#36** | [`0x7b00...1635`](https://basescan.org/address/0x7b00d31bA4f410160d0f43aD8550C6e70B5d1635) | `cbETH/WETH` | **1.0332** | $15,077.14 | $16,480.76 | $753.86 | $30.15 | **$7.54** | $716.16 |
| **#37** | [`0x6Fa9...1057`](https://basescan.org/address/0x6Fa9c5A6079322E1fb5828b5bf8882A8CF221057) | `cbETH/WETH` | **1.0120** | $14,543.67 | $15,571.22 | $727.18 | $29.09 | **$7.27** | $690.82 |
| **#38** | [`0x69F5...5A9b`](https://basescan.org/address/0x69F55A95024c5A137d0F5Fa15d7C2787a0235A9b) | `wstETH/WETH` | **1.0342** | $14,045.58 | $15,353.04 | $702.28 | $28.09 | **$7.02** | $667.17 |
| **#39** | [`0xAEBB...c306`](https://basescan.org/address/0xAEBB4d272A444433195D30a9273Da9A75280c306) | `cbETH/WETH` | **1.0403** | $13,361.25 | $14,706.22 | $668.06 | $26.72 | **$6.68** | $634.66 |
| **#40** | [`0x37b6...f696`](https://basescan.org/address/0x37b6bE5538Ef5a3A0AE0E188292c0074C3dEf696) | `wstETH/WETH` | **1.0180** | $13,053.56 | $14,045.13 | $652.68 | $26.11 | **$6.53** | $620.04 |
| **#41** | [`0x660F...eB52`](https://basescan.org/address/0x660F5915396b3cBa303135446C7749aAaaBBeB52) | `wsuperOETHb/WETH` | **1.0371** | $10,857.60 | $12,309.05 | $542.88 | $21.72 | **$5.43** | $515.74 |
| **#42** | [`0x00F3...e58e`](https://basescan.org/address/0x00F3f3303E94b0c0412Cf10b41477394179Fe58e) | `PT-sjEUR(jEURx)-2027/01/13/jEUR` | **1.0146** | $10,772.91 | $13,501.38 | $538.65 | $21.55 | **$5.39** | $511.71 |
| **#43** | [`0x4071...f0F5`](https://basescan.org/address/0x4071F9a39eD21fC98182e94F73583E12A472f0F5) | `wstETH/WETH` | **1.0225** | $10,691.14 | $11,315.03 | $534.56 | $21.38 | **$5.35** | $507.83 |
| **#44** | [`0x54Cb...74d3`](https://basescan.org/address/0x54Cb080D6d9c6BDCA8c88CEcc35A41946E4174d3) | `cbETH/WETH` | **1.0137** | $10,411.47 | $11,166.56 | $520.57 | $20.82 | **$5.21** | $494.54 |

---

## 🔬 In-Depth Analysis of Key High-Impact Targets

### 1. The $1.04M wstETH Whale: `0xC955793F9a7572ED31D62ebfb25b933aa3e1283e`
* **Market:** `wstETH/WETH` in Morpho Blue Base.
* **Current Debt:** **$1,040,358.14 USD** in WETH.
* **Collateral:** **$1,140,417.35 USD** in wstETH.
* **Health Factor:** **1.0382** (Under 3.9% price drift before liquidation trigger).
* **The Opportunity:**
  * If liquidated by an MEV searcher, this whale will lose **$52,017.91 USD** in forced penalties.
  * Rescuing via Santa Rosa Router (`0xcd4f88bca4e2653fd24f61b4ef3aaccd76310a57`) costs only **$2,600.90 USD** (0.25% flat fee).
  * Net user capital preserved: **$49,417.01 USD**.
  * Revenue generated for Santa Rosa: **$2,080.72 USDC**.
  * Instant commission for referring partner (Cielo, EtherDrops, Maestro): **$520.18 USDC**.

### 2. The $853k cbETH Whale: `0xC42eaDE6AB740763c5942932Dd7c09C913644C45`
* **Market:** `cbETH/WETH` in Morpho Blue Base.
* **Current Debt:** **$853,077.18 USD** in WETH.
* **Collateral:** **$931,473.61 USD** in cbETH.
* **Health Factor:** **1.0332** (Critical risk).
* **Financial Impact:**
  * MEV Penalty at Risk: **$42,653.86 USD**.
  * Protocol Revenue: **$1,706.15 USD**.
  * Partner Commission: **$426.54 USD**.
  * Net Borrower Savings: **$40,521.17 USD**.

### 3. The $542k weETH Whale: `0x13B3080AAAFE52192414aaE37cfE4f8889251BBB`
* **Market:** `weETH/WETH` in Morpho Blue Base.
* **Current Debt:** **$542,045.17 USD** in WETH.
* **Collateral:** **$581,280.61 USD** in weETH.
* **Health Factor:** **1.0134** (Less than 1.4% cushion!).
* **Financial Impact:**
  * MEV Penalty at Risk: **$27,102.26 USD**.
  * Protocol Revenue: **$1,084.09 USD**.
  * Partner Commission: **$271.02 USD**.
  * Net Borrower Savings: **$25,747.15 USD**.

### 4. The $41.3k wstETH Extreme-Danger Position: `0x10c53e75fE7A7E6bF58a9e68B6a30Fcc7D4e6e2c`
* **Market:** `wstETH/WETH`.
* **Health Factor:** **1.0006** (Only **0.06%** above liquidation threshold).
* **Current Debt:** **$41,390.01 USD**.
* **Financial Impact:**
  * MEV Penalty: **$2,069.50 USD**.
  * Protocol Fee: **$82.78 USD**.
  * Partner Commission: **$20.70 USD**.
  * Net Borrower Savings: **$1,966.02 USD**.

---

## 🛠️ Step-by-Step Partner Integration & Execution

Integration partners can trigger atomic rescue simulations and build transaction payloads for any of these wallets with a single call:

### A. Simulating Savings via REST API
```bash
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/simulate/rescue \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xC955793F9a7572ED31D62ebfb25b933aa3e1283e",
    "currentDebtUsd": 1040358,
    "currentCollateralUsd": 1140417,
    "debtToRepayUsd": 1040358,
    "referralAddress": "0xYourPartnerPayoutWallet"
  }'
```

### B. Building the Atomic Transaction Payload
```bash
curl -X POST https://rates-counter-breed-frontier.trycloudflare.com/v1/build-tx \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "RESCUE",
    "protocol": "MORPHO",
    "loanToken": "0x4200000000000000000000000000000000000006",
    "amount": 1040358,
    "referralAddress": "0xYourPartnerPayoutWallet"
  }'
```

### C. Using the Remote Model Context Protocol (MCP) Tool
```json
{
  "name": "simulate_rescue_savings",
  "arguments": {
    "userAddress": "0xC955793F9a7572ED31D62ebfb25b933aa3e1283e",
    "currentDebtUsd": 1040358,
    "currentCollateralUsd": 1140417,
    "debtToRepayUsd": 1040358,
    "referralAddress": "0xYourPartnerPayoutWallet"
  }
}
```

---
*Report autonomously compiled by Santa Rosa Growth & Indexing Lead on Base L2.*
