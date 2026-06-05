// Capital Gains Tax Calculation
// Product #16 | DHH | 2025-06-05

import {
  CAPITAL_GAINS_THRESHOLDS_2025,
  LTCG_RATES,
  CapitalGainsResult,
} from './types';

/**
 * Calculate capital gains tax for RSU sales
 * RSUs always have cost basis = vest price (ordinary income already taxed at vest)
 */
export function calculateCapitalGains(
  proceeds: number,
  costBasis: number,
  otherIncome: number,
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH' = 'SINGLE',
  holdingPeriodDays: number = 0
): CapitalGainsResult {
  const gain = proceeds - costBasis;

  if (gain <= 0) {
    return {
      stcg: 0,
      stcgTax: 0,
      ltcg: 0,
      ltcgTax: 0,
      totalTax: 0,
    };
  }

  // Determine if short-term or long-term
  const isLongTerm = holdingPeriodDays >= 365;

  const thresholds = CAPITAL_GAINS_THRESHOLDS_2025[filingStatus];

  if (isLongTerm) {
    // Long-term capital gains: 0%, 15%, or 20%
    const taxableIncomeForLTCG = otherIncome;

    let rate = LTCG_RATES.TWENTY; // Default 20%

    if (taxableIncomeForLTCG <= thresholds.ZERO) {
      rate = LTCG_RATES.ZERO;
    } else if (taxableIncomeForLTCG <= thresholds.FIFTEEN) {
      rate = LTCG_RATES.FIFTEEN;
    }

    const ltcgTax = gain * rate;

    return {
      stcg: 0,
      stcgTax: 0,
      ltcg: gain,
      ltcgTax,
      totalTax: ltcgTax,
    };
  } else {
    // Short-term capital gains: taxed at ordinary income rates
    // We'll calculate this in the federal tax module
    return {
      stcg: gain,
      stcgTax: 0, // Will be calculated as ordinary income
      ltcg: 0,
      ltcgTax: 0,
      totalTax: 0,
    };
  }
}

/**
 * Calculate potential tax savings from waiting for long-term treatment
 */
export function calculateLongTermSavings(
  gain: number,
  currentOrdinaryRate: number,
  otherIncome: number,
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH' = 'SINGLE'
): {
  shortTermTax: number;
  longTermTax: number;
  savings: number;
  savingsRate: number;
} {
  const thresholds = CAPITAL_GAINS_THRESHOLDS_2025[filingStatus];

  // Short-term tax (at ordinary rate)
  const shortTermTax = gain * currentOrdinaryRate;

  // Long-term tax
  let ltcgRate = LTCG_RATES.TWENTY;
  if (otherIncome <= thresholds.ZERO) {
    ltcgRate = LTCG_RATES.ZERO;
  } else if (otherIncome <= thresholds.FIFTEEN) {
    ltcgRate = LTCG_RATES.FIFTEEN;
  }

  const longTermTax = gain * ltcgRate;
  const savings = shortTermTax - longTermTax;
  const savingsRate = shortTermTax > 0 ? savings / shortTermTax : 0;

  return {
    shortTermTax,
    longTermTax,
    savings,
    savingsRate,
  };
}
