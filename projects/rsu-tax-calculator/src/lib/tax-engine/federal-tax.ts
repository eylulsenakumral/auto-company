// Federal Tax Calculation
// Product #16 | DHH | 2025-06-05

import {
  FEDERAL_BRACKETS_2025,
  FEDERAL_BRACKETS_MFJ_2025,
  FEDERAL_BRACKETS_HOH_2025,
  STANDARD_DEDUCTION_2025,
  FederalTaxResult,
  BracketTax,
} from './types';

/**
 * Calculate federal income tax using progressive brackets
 * Uses exclusive upper bound semantics: max value is NOT included in bracket
 */
export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH' = 'SINGLE'
): FederalTaxResult {
  // Get brackets based on filing status
  const brackets =
    filingStatus === 'MFJ'
      ? FEDERAL_BRACKETS_MFJ_2025
      : filingStatus === 'HOH'
      ? FEDERAL_BRACKETS_HOH_2025
      : FEDERAL_BRACKETS_2025;

  const standardDeduction =
    filingStatus === 'MFJ'
      ? STANDARD_DEDUCTION_2025.MFJ
      : filingStatus === 'HOH'
      ? STANDARD_DEDUCTION_2025.HOH
      : STANDARD_DEDUCTION_2025.SINGLE;

  // Calculate taxable income after standard deduction
  const finalTaxableIncome = Math.max(0, taxableIncome - standardDeduction);

  if (finalTaxableIncome === 0) {
    return {
      tax: 0,
      effectiveRate: 0,
      brackets: [],
    };
  }

  let totalTax = 0;
  let remainingIncome = finalTaxableIncome;
  const bracketTaxes: BracketTax[] = [];

  for (const bracket of brackets) {
    const bracketWidth =
      bracket.max === null ? Infinity : bracket.max - bracket.min;
    const taxableInBracket = Math.min(remainingIncome, bracketWidth);
    const taxInBracket = taxableInBracket * bracket.rate;

    if (taxableInBracket > 0) {
      bracketTaxes.push({
        bracket: `${(bracket.rate * 100).toFixed(0)}%`,
        rate: bracket.rate,
        taxableAmount: taxableInBracket,
        tax: taxInBracket,
      });
      totalTax += taxInBracket;
      remainingIncome -= taxableInBracket;
    }

    if (remainingIncome <= 0) break;
  }

  return {
    tax: totalTax,
    effectiveRate: taxableIncome > 0 ? totalTax / taxableIncome : 0,
    brackets: bracketTaxes,
  };
}

/**
 * Get marginal tax rate for a given income level
 */
export function getMarginalRate(
  taxableIncome: number,
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH' = 'SINGLE'
): number {
  const brackets =
    filingStatus === 'MFJ'
      ? FEDERAL_BRACKETS_MFJ_2025
      : filingStatus === 'HOH'
      ? FEDERAL_BRACKETS_HOH_2025
      : FEDERAL_BRACKETS_2025;

  const standardDeduction =
    filingStatus === 'MFJ'
      ? STANDARD_DEDUCTION_2025.MFJ
      : filingStatus === 'HOH'
      ? STANDARD_DEDUCTION_2025.HOH
      : STANDARD_DEDUCTION_2025.SINGLE;

  const finalTaxableIncome = Math.max(0, taxableIncome - standardDeduction);

  for (const bracket of brackets) {
    if (
      finalTaxableIncome >= bracket.min &&
      (bracket.max === null || finalTaxableIncome < bracket.max)
    ) {
      return bracket.rate;
    }
  }

  return brackets[brackets.length - 1].rate;
}
