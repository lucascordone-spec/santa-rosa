export interface MorphoPosition {
  protocol: string;
  marketOrAsset: string;
  debtUsd: number;
  collateralUsd: number;
  healthFactor: number;
  borrowApy: number;
}

export interface RescueSimulationResult {
  user: string;
  statusBefore: {
    healthFactor: number;
    riskLevel: string;
    debtUsd: number;
    collateralUsd: number;
  };
  statusAfter: {
    projectedHealthFactor: number;
    riskLevel: string;
    remainingDebtUsd: number;
    remainingCollateralUsd: number;
  };
  financialComparison: {
    liquidationPenaltyIfLiquidatedUsd: number;
    flashShiftFeeUsd: number;
    builderFeeUsd: number;
    protocolFeeUsd: number;
    netMoneySavedUsd: number;
    savingsMultiplier: string;
  };
  execution: {
    mode: string;
    gasCostBaseL2Estimate: string;
    readyToExecute: boolean;
  };
}

export interface ReadyToSignTransaction {
  status: string;
  to: string;
  network: string;
  value: string;
  targetProtocol: string;
  actionType: string;
  flashLoanProvider: string;
  referral: string;
  gasEstimateL2: string;
  note: string;
}
