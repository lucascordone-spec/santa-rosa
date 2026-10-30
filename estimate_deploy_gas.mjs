import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { base } from 'viem/chains';
import fs from 'fs';

const client = createPublicClient({ chain: base, transport: http('https://mainnet.base.org') });

async function estimate() {
  const artifact = JSON.parse(fs.readFileSync('./contracts/out/FlashShiftRouter.sol/FlashShiftRouter.json', 'utf8'));
  const bytecode = artifact.bytecode.object;
  const abi = artifact.abi;

  const MORPHO = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb";
  const AAVE = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
  const TREASURY = "0x8f7670EA615910D0A86320e84A611577F68E3908";
  const KYBER = "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5";

  const wallet = "0x8f7670EA615910D0A86320e84A611577F68E3908";
  const balance = await client.getBalance({ address: wallet });
  const gasPrice = await client.getGasPrice();

  console.log("Wallet Balance:", formatEther(balance), "ETH");
  console.log("Current Base Gas Price:", Number(gasPrice) / 1e9, "gwei");

  // Estimar gas de deploy
  try {
    const gasEstimate = await client.estimateGas({
      account: wallet,
      data: bytecode + '000000000000000000000000bbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb' +
                      '000000000000000000000000a238dd80c259a72e81d7e4664a9801593f98d1c5' +
                      '0000000000000000000000008f7670ea615910d0a86320e84a611577f68e3908' +
                      '0000000000000000000000006131b5fae19ea4f9d964eac0408e4408b66337b5'
    });

    console.log("Estimated Deploy Gas:", gasEstimate.toString());
    const estimatedCostWei = gasEstimate * gasPrice;
    console.log("Estimated L2 Execution Cost:", formatEther(estimatedCostWei), "ETH");

    if (balance > estimatedCostWei) {
      console.log("STATUS: SUFFICIENT BALANCE FOR DEPLOYMENT!");
    } else {
      console.log("STATUS: INSUFFICIENT BALANCE. Needed:", formatEther(estimatedCostWei), "ETH");
    }
  } catch (e) {
    console.error("Estimate error:", e.message);
  }
}

estimate();
