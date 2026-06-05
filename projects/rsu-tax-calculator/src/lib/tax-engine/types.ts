// RSU Tax Calculator - Type Definitions
// Product #16 | DHH | 2025-06-05

export interface TaxInput {
  shares: number;
  vestPrice: number;
  sellPrice: number;
  otherIncome: number;
  filingStatus: 'SINGLE' | 'MFJ' | 'HOH';
  compare?: boolean;
}

export interface FederalTaxResult {
  tax: number;
  effectiveRate: number;
  brackets: BracketTax[];
}

export interface BracketTax {
  bracket: string;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface CapitalGainsResult {
  stcg: number; // Short-term capital gains
  stcgTax: number;
  ltcg: number; // Long-term capital gains
  ltcgTax: number;
  totalTax: number;
}

export interface AMTResult {
  amtTaxable: number;
  amtExemption: number;
  exemptionPhaseout: number;
  amtTax: number;
  regularTax: number;
  owesAMT: boolean;
  amtCredit: number;
}

export interface Scenario {
  name: string;
  proceeds: number;
  ordinaryTax: number;
  capitalGainsTax: number;
  totalTax: number;
  netProceeds: number;
  effectiveRate: number;
  holdingPeriod: 'SHORT' | 'LONG';
}

export interface ComparisonResult {
  comparison: Scenario[];
  recommendation: string;
}

export interface FullCalculation {
  proceeds: number;
  ordinaryTax: number;
  capitalGainsTax: number;
  totalTax: number;
  netProceeds: number;
  effectiveRate: number;
  year: number;
  holdingPeriod: 'SHORT' | 'LONG';
  brackets?: BracketTax[];
  comparison?: ComparisonResult;
  amt?: AMTResult;
}

// IRS 2025 Tax Brackets (Single Filer)
// Corrected bracket boundaries per IRS official values
export const FEDERAL_BRACKETS_2025: readonly Readonly<{
  min: number;
  max: number | null;
  rate: number;
}>[] = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: null, rate: 0.37 },
] as const;

// Married Filing Jointly 2025
export const FEDERAL_BRACKETS_MFJ_2025 = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: null, rate: 0.37 },
] as const;

// Head of Household 2025
export const FEDERAL_BRACKETS_HOH_2025 = [
  { min: 0, max: 16550, rate: 0.10 },
  { min: 16550, max: 63100, rate: 0.12 },
  { min: 63100, max: 100500, rate: 0.22 },
  { min: 100500, max: 191950, rate: 0.24 },
  { min: 191950, max: 243700, rate: 0.32 },
  { min: 243700, max: 609350, rate: 0.35 },
  { min: 609350, max: null, rate: 0.37 },
] as const;

// 2025 Standard Deductions
export const STANDARD_DEDUCTION_2025 = {
  SINGLE: 14600,
  MFJ: 29200,
  HOH: 21800,
} as const;

// 2025 AMT Exemptions
export const AMT_EXEMPTION_2025 = {
  SINGLE: 81800,
  MFJ: 127200,
  HOH: 81800,
} as const;

// AMT Phaseout Thresholds (2025)
export const AMT_PHASEOUT_2025 = {
  SINGLE: 630800,
  MFJ: 1006000,
  HOH: 630800,
} as const;

// Capital Gains Thresholds (2025)
export const CAPITAL_GAINS_THRESHOLDS_2025 = {
  SINGLE: {
    ZERO: 47000,
    FIFTEEN: 518900,
  },
  MFJ: {
    ZERO: 94000,
    FIFTEEN: 1037800,
  },
  HOH: {
    ZERO: 63000,
    FIFTEEN: 551850,
  },
} as const;

// Long-term capital gains rates
export const LTCG_RATES: Record<string, number> = {
  ZERO: 0,
  FIFTEEN: 0.15,
  TWENTY: 0.20,
};

// Holding period threshold (in days)
export const LONG_TERM_THRESHOLD_DAYS = 365;
