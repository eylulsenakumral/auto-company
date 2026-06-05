// Alternative Minimum Tax (AMT) Calculation for ISOs
// Product #16 | DHH | 2025-06-05

import {
  AMT_EXEMPTION_2025,
  AMT_PHASEOUT_2025,
  AMTResult,
} from './types';

/**
 * Calculate AMT for ISO exercise
 *
 * ISO bargain element = FMV at exercise - strike price
 * This is added to AMT taxable income even if not sold
 */
export function calculateAMT(
  bargainElement: number,
  otherIncome: number,
  regularTax: number,
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH' = 'SINGLE'
): AMTResult {
  // Get AMT exemption and phaseout
  const exemption = AMT_EXEMPTION_2025[filingStatus];
  const phaseoutThreshold = AMT_PHASEOUT_2025[filingStatus];

  // Calculate AMT taxable income
  // For ISOs: bargain element is included in AMT income
  const amtIncome = otherIncome + bargainElement;

  // Calculate exemption phaseout
  // Exemption is reduced by 25 cents for each dollar over threshold
  let exemptionPhaseout = 0;
  let effectiveExemption = exemption;

  if (amtIncome > phaseoutThreshold) {
    const excess = amtIncome - phaseoutThreshold;
    exemptionPhaseout = Math.min(excess * 0.25, exemption); // Phaseout reduces exemption to zero
    effectiveExemption = exemption - exemptionPhaseout;
  }

  // AMT taxable income after exemption
  const amtTaxable = Math.max(0, amtIncome - effectiveExemption);

  // AMT tax calculation: 26% on first ~$232,000, 28% above
  // Using simplified brackets for MVP
  const AMT_BRACKET_THRESHOLD = 232000; // Approximate for all filing statuses
  let amtTax = 0;

  if (amtTaxable <= AMT_BRACKET_THRESHOLD) {
    amtTax = amtTaxable * 0.26;
  } else {
    amtTax = AMT_BRACKET_THRESHOLD * 0.26 + (amtTaxable - AMT_BRACKET_THRESHOLD) * 0.28;
  }

  // AMT credit: difference between AMT and regular tax
  // Credit can be used in future years when regular tax > AMT
  const owesAMT = amtTax > regularTax;
  const amtCredit = owesAMT ? amtTax - regularTax : 0;

  return {
    amtTaxable: amtTaxable,
    amtExemption: effectiveExemption,
    exemptionPhaseout,
    amtTax,
    regularTax,
    owesAMT,
    amtCredit,
  };
}

/**
 * Calculate AMT impact for qualifying vs disqualifying disposition
 *
 * Qualifying: Hold >2 years from grant AND >1 year from exercise
 * - Bargain element taxed as long-term capital gains
 * - No AMT adjustment needed (credit can be used)
 *
 * Disqualifying: Sold before holding period met
 * - Bargain element taxed as ordinary income
 * - AMT paid is "lost" (no credit available)
 */
export function calculateDispositionImpact(
  amtPaid: number,
  isQualifying: boolean
): {
  amtCreditAvailable: number;
  amtLost: number;
} {
  if (isQualifying) {
    // Qualifying disposition: AMT credit becomes available
    return {
      amtCreditAvailable: amtPaid,
      amtLost: 0,
    };
  } else {
    // Disqualifying: AMT paid is lost
    return {
      amtCreditAvailable: 0,
      amtLost: amtPaid,
    };
  }
}
