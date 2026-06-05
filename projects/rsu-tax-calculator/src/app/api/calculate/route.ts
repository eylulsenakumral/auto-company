// POST /api/calculate
// RSU Tax Calculator API
// Product #16 | DHH | 2025-06-05

import { NextRequest, NextResponse } from 'next/server';
import { calculateScenario, calculateScenarios } from '@/lib/tax-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const {
      shares,
      vestPrice,
      sellPrice,
      otherIncome,
      filingStatus = 'SINGLE',
      compare = false,
    } = body;

    // Basic validation
    if (shares === undefined || vestPrice === undefined || sellPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: shares, vestPrice, sellPrice' },
        { status: 400 }
      );
    }

    if (shares < 0 || vestPrice < 0 || sellPrice < 0) {
      return NextResponse.json(
        { error: 'shares, vestPrice, and sellPrice must be non-negative' },
        { status: 400 }
      );
    }

    if (otherIncome !== undefined && otherIncome < 0) {
      return NextResponse.json(
        { error: 'otherIncome must be non-negative' },
        { status: 400 }
      );
    }

    if (!['SINGLE', 'MFJ', 'HOH'].includes(filingStatus)) {
      return NextResponse.json(
        { error: 'filingStatus must be SINGLE, MFJ, or HOH' },
        { status: 400 }
      );
    }

    const input = {
      shares: Number(shares),
      vestPrice: Number(vestPrice),
      sellPrice: Number(sellPrice),
      otherIncome: otherIncome !== undefined ? Number(otherIncome) : 0,
      filingStatus,
      compare,
    };

    if (compare) {
      const result = calculateScenarios(input);
      return NextResponse.json(result);
    } else {
      const result = calculateScenario(input);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
