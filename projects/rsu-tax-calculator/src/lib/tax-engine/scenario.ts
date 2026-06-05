// Scenario Calculation and Comparison
// Product #16 | DHH | 2025-06-05

import { calculateFederalTax, getMarginalRate } from './federal-tax';
import { calculateCapitalGains, calculateLongTermSavings } from './capital-gains';
import { calculateAMT } from './amt';
import {
  TaxInput,
  Scenario,
  ComparisonResult,
  FullCalculation,
} from './types';

/**
 * Calculate single RSU sale scenario
 */
export function calculateScenario(input: TaxInput): FullCalculation {
  const { shares, vestPrice, sellPrice, otherIncome, filingStatus } = input;

  // Calculate proceeds and cost basis
  const proceeds = shares * sellPrice;
  const costBasis = shares * vestPrice;
  const gain = proceeds - costBasis;

  // RSU vesting is always ordinary income (taxed at vest)
  // At sale, we only pay capital gains on the difference
  const vestIncome = costBasis; // RSU value at vest (already taxed as ordinary income)
  const ordinaryIncomeAtVest = vestIncome;

  // Calculate capital gains tax on the sale
  // Default to short-term (holding period < 1 year)
  const holdingPeriodDays = 0; // Assume selling immediately
  const cgResult = calculateCapitalGains(
    proceeds,
    costBasis,
    otherIncome + ordinaryIncomeAtVest,
    filingStatus,
    holdingPeriodDays
  );

  // For RSUs: ordinary tax was already paid at vest
  // We only care about capital gains tax on the sale
  // Short-term gains are taxed at ordinary rates
  let ordinaryTax = 0;
  let capitalGainsTax = 0;

  if (holdingPeriodDays < 365) {
    // Short-term: taxed at ordinary income rates
    const totalOrdinaryIncome = otherIncome + ordinaryIncomeAtVest + cgResult.stcg;
    const fedTax = calculateFederalTax(totalOrdinaryIncome, filingStatus);
    const fedTaxNoSale = calculateFederalTax(otherIncome + ordinaryIncomeAtVest, filingStatus);
    ordinaryTax = fedTax.tax - fedTaxNoSale.tax; // Incremental tax from the sale
    capitalGainsTax = 0;
  } else {
    // Long-term: taxed at capital gains rates
    capitalGainsTax = cgResult.ltcgTax;
    ordinaryTax = 0;
  }

  const totalTax = ordinaryTax + capitalGainsTax;
  const netProceeds = proceeds - totalTax;
  const effectiveRate = proceeds > 0 ? totalTax / proceeds : 0;

  return {
    proceeds,
    ordinaryTax,
    capitalGainsTax,
    totalTax,
    netProceeds,
    effectiveRate,
    year: 2025,
    holdingPeriod: holdingPeriodDays >= 365 ? 'LONG' : 'SHORT',
  };
}

/**
 * Calculate multiple sell-now vs sell-later scenarios
 */
export function calculateScenarios(
  baseInput: TaxInput
): ComparisonResult {
  const currentPrice = baseInput.sellPrice;

  // Generate scenario inputs with different sell prices
  const scenarioInputs: Array<{ name: string } & TaxInput> = [
    {
      name: 'Sell Now',
      shares: baseInput.shares,
      vestPrice: baseInput.vestPrice,
      sellPrice: currentPrice,
      otherIncome: baseInput.otherIncome,
      filingStatus: baseInput.filingStatus,
    },
    {
      name: 'Sell in 3 months',
      shares: baseInput.shares,
      vestPrice: baseInput.vestPrice,
      sellPrice: currentPrice * 1.05, // +5% projection
      otherIncome: baseInput.otherIncome,
      filingStatus: baseInput.filingStatus,
    },
    {
      name: 'Sell in 6 months',
      shares: baseInput.shares,
      vestPrice: baseInput.vestPrice,
      sellPrice: currentPrice * 1.10, // +10% projection
      otherIncome: baseInput.otherIncome,
      filingStatus: baseInput.filingStatus,
    },
    {
      name: 'Sell in 1 year',
      shares: baseInput.shares,
      vestPrice: baseInput.vestPrice,
      sellPrice: currentPrice * 1.10, // +10% projection
      otherIncome: baseInput.otherIncome,
      filingStatus: baseInput.filingStatus,
    },
  ];

  // Also add pessimistic scenarios
  const pessimisticInputs: Array<{ name: string } & TaxInput> = [
    {
      name: 'Sell Now (Pessimistic)',
      shares: baseInput.shares,
      vestPrice: baseInput.vestPrice,
      sellPrice: currentPrice * 0.95, // -5% projection
      otherIncome: baseInput.otherIncome,
      filingStatus: baseInput.filingStatus,
    },
  ];

  const allInputs = [...scenarioInputs, ...pessimisticInputs];

  // Calculate each scenario
  const comparison: Scenario[] = allInputs.map((input) => {
    const result = calculateScenario(input as TaxInput);
    return {
      name: input.name,
      proceeds: result.proceeds,
      ordinaryTax: result.ordinaryTax,
      capitalGainsTax: result.capitalGainsTax,
      totalTax: result.totalTax,
      netProceeds: result.netProceeds,
      effectiveRate: result.effectiveRate,
      holdingPeriod: result.holdingPeriod,
    };
  });

  // Find best scenario (highest net proceeds)
  const best = comparison.reduce((prev, current) =>
    current.netProceeds > prev.netProceeds ? current : prev
  );

  const recommendation = `Best to ${best.name.toLowerCase()} for $${best.netProceeds.toFixed(2)} net proceeds`;

  return {
    comparison,
    recommendation,
  };
}

/**
 * Calculate optimal sell schedule for multiple vesting lots
 */
export function optimizeSellSchedule(lots: {
  vestDate: Date;
  vestPrice: number;
  shares: number;
}[]): {
  recommendations: string[];
  potentialSavings: number;
} {
  const recommendations: string[] = [];
  let totalPotentialSavings = 0;

  const currentDate = new Date();

  lots.forEach((lot) => {
    const vestDate = new Date(lot.vestDate);
    const daysSinceVest = Math.floor(
      (currentDate.getTime() - vestDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysUntilLongTerm = Math.max(0, 365 - daysSinceVest);

    if (daysSinceVest >= 365) {
      recommendations.push(
        `Lot vested ${daysSinceVest} days ago: Already long-term. Sell anytime.`
      );
    } else if (daysUntilLongTerm <= 90) {
      const estimatedSavings = lot.shares * lot.vestPrice * 0.1; // Rough estimate
      totalPotentialSavings += estimatedSavings;
      recommendations.push(
        `Lot vests in ${daysUntilLongTerm} days: Consider waiting ${daysUntilLongTerm} days for long-term treatment (potential savings: ~$${estimatedSavings.toFixed(2)}).`
      );
    } else {
      recommendations.push(
        `Lot vests in ${daysUntilLongTerm} days: Long-term treatment available in ${Math.floor(daysUntilLongTerm / 30)} months.`
      );
    }
  });

  return {
    recommendations,
    potentialSavings: totalPotentialSavings,
  };
}
