async function run() {
  const BASE_URL = 'http://localhost:3000';

  console.log('--- 1. Testing GET /health ---');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('Health:', healthData);

  console.log('\n--- 2. Testing POST /v1/quote/rescue ---');
  const quoteRes = await fetch(`${BASE_URL}/v1/quote/rescue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      borrowedAmountUsd: 100000,
      referralAddress: '0x2222222222222222222222222222222222222222'
    })
  });
  const quoteData = await quoteRes.json();
  console.log('Quote Rescue:', quoteData);

  console.log('\n--- 3. Testing POST /v1/simulate/rescue ---');
  const simRes = await fetch(`${BASE_URL}/v1/simulate/rescue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddress: '0x1111111111111111111111111111111111111111',
      currentDebtUsd: 100000,
      currentCollateralUsd: 110000,
      debtToRepayUsd: 30000,
      lltvBps: 8600,
      referralAddress: '0x2222222222222222222222222222222222222222'
    })
  });
  const simData = await simRes.json();
  console.log('Simulation Summary:', simData.summary);
  console.log('Financial Comparison:', simData.simulation.financialComparison);
  console.log('Health Factor:', simData.simulation.healthFactor);

  console.log('\n--- 4. Testing POST /v1/build-tx ---');
  const txRes = await fetch(`${BASE_URL}/v1/build-tx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actionType: 'RESCUE',
      protocol: 'MORPHO',
      loanToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: 30000,
      referralAddress: '0x2222222222222222222222222222222222222222'
    })
  });
  const txData = await txRes.json();
  console.log('Build TX response:', txData);
}

run().catch(console.error);
