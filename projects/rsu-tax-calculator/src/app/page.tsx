'use client';

// RSU Tax Calculator - Main UI
// Product #16 | DHH | 2025-06-05

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CalculationResult {
  proceeds: number;
  ordinaryTax: number;
  capitalGainsTax: number;
  totalTax: number;
  netProceeds: number;
  effectiveRate: number;
  year: number;
  holdingPeriod: 'SHORT' | 'LONG';
  brackets?: Array<{
    bracket: string;
    rate: number;
    taxableAmount: number;
    tax: number;
  }>;
}

interface ComparisonResult {
  comparison: Array<{
    name: string;
    proceeds: number;
    ordinaryTax: number;
    capitalGainsTax: number;
    totalTax: number;
    netProceeds: number;
    effectiveRate: number;
    holdingPeriod: 'SHORT' | 'LONG';
  }>;
  recommendation: string;
}

export default function Home() {
  const [shares, setShares] = useState('100');
  const [vestPrice, setVestPrice] = useState('50');
  const [sellPrice, setSellPrice] = useState('60');
  const [otherIncome, setOtherIncome] = useState('100000');
  const [filingStatus, setFilingStatus] = useState<'SINGLE' | 'MFJ' | 'HOH'>('SINGLE');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const calculate = async (compare = false) => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shares: Number(shares),
          vestPrice: Number(vestPrice),
          sellPrice: Number(sellPrice),
          otherIncome: Number(otherIncome),
          filingStatus,
          compare,
        }),
      });

      const data = await response.json();

      if (compare) {
        setComparison(data);
        setResult(null);
      } else {
        setResult(data);
        setComparison(null);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const bracketChartData = result?.brackets?.map((b) => ({
    bracket: b.bracket,
    tax: b.tax,
    taxable: b.taxableAmount,
  }));

  const comparisonChartData = comparison?.comparison.map((c) => ({
    name: c.name,
    'Net Proceeds': c.netProceeds,
    Tax: c.totalTax,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 print:bg-white">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 print:bg-white print:border-black">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center print:text-black">
            <strong>Disclaimer:</strong> This calculator is for educational purposes only and does not constitute tax, legal, or financial advice.
            Consult a qualified tax professional for your specific situation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 print:text-black">
            RSU Tax Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 print:text-black">
            Understand your tax liability on Restricted Stock Unit sales (2025 Tax Year)
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 print:bg-white print:shadow-none print:border print:border-black">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 print:text-black">
              Enter Your Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 print:text-black">
                  Number of Shares
                </label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:bg-white print:text-black"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 print:text-black">
                  Vest Price per Share ($)
                </label>
                <input
                  type="number"
                  value={vestPrice}
                  onChange={(e) => setVestPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:bg-white print:text-black"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 print:text-black">
                  Current/Sell Price per Share ($)
                </label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:bg-white print:text-black"
                  placeholder="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 print:text-black">
                  Other Annual Income ($)
                </label>
                <input
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:bg-white print:text-black"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 print:text-black">
                  Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:bg-white print:text-black"
                >
                  <option value="SINGLE">Single</option>
                  <option value="MFJ">Married Filing Jointly</option>
                  <option value="HOH">Head of Household</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => calculate(false)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 print:bg-black print:text-white"
                >
                  {loading ? 'Calculating...' : 'Calculate Tax'}
                </button>
                <button
                  onClick={() => calculate(true)}
                  disabled={loading}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 print:bg-black print:text-white"
                >
                  {loading ? 'Calculating...' : 'Compare Scenarios'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 print:bg-white print:shadow-none print:border print:border-black">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 print:text-black">
              {comparison ? 'Scenario Comparison' : 'Tax Calculation'}
            </h2>

            {result && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md print:bg-white print:border print:border-black">
                    <p className="text-sm text-slate-600 dark:text-slate-400 print:text-black">Gross Proceeds</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 print:text-black">
                      ${result.proceeds.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md print:bg-white print:border print:border-black">
                    <p className="text-sm text-green-600 dark:text-green-400 print:text-black">Net Proceeds</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300 print:text-black">
                      ${result.netProceeds.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md print:bg-white print:border print:border-black">
                    <p className="text-sm text-red-600 dark:text-red-400 print:text-black">Total Tax</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300 print:text-black">
                      ${result.totalTax.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md print:bg-white print:border print:border-black">
                    <p className="text-sm text-slate-600 dark:text-slate-400 print:text-black">Effective Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 print:text-black">
                      {(result.effectiveRate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className="border-t border-slate-200 dark:border-slate-700 print:border-black pt-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 print:text-black mb-2">Tax Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 print:text-black">Capital Gains Tax</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 print:text-black">
                        ${result.capitalGainsTax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 print:text-black">Ordinary Income Tax</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 print:text-black">
                        ${result.ordinaryTax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 print:border-black">
                      <span className="font-medium text-slate-900 dark:text-slate-100 print:text-black">Total</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 print:text-black">
                        ${result.totalTax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Holding Period */}
                <div className={`p-4 rounded-md print:bg-white print:border print:border-black ${result.holdingPeriod === 'LONG' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                  <p className={`font-medium ${result.holdingPeriod === 'LONG' ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'} print:text-black`}>
                    Holding Period: <span className="font-bold">{result.holdingPeriod === 'LONG' ? 'LONG-TERM' : 'SHORT-TERM'}</span>
                  </p>
                  <p className={`text-sm mt-1 ${result.holdingPeriod === 'LONG' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'} print:text-black`}>
                    {result.holdingPeriod === 'LONG'
                      ? 'Qualified for favorable long-term capital gains rates'
                      : 'Subject to short-term capital gains rates (same as ordinary income)'}
                  </p>
                </div>

                {/* Tax Bracket Visualization */}
                {result.brackets && result.brackets.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 print:border-black pt-4">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 print:text-black mb-4">Tax Bracket Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={bracketChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="bracket" type="category" width={60} />
                        <Tooltip
                          formatter={(value: any) => typeof value === 'number' ? `$${value.toFixed(2)}` : String(value)}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <Legend />
                        <Bar dataKey="tax" fill="#3b82f6" name="Tax Amount" />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bracket Table */}
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 print:border-black">
                            <th className="text-left py-2 text-slate-700 dark:text-slate-300 print:text-black">Bracket</th>
                            <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Taxable Amount</th>
                            <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Tax</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.brackets.map((bracket, idx) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 print:border-black">
                              <td className="py-2 text-slate-900 dark:text-slate-100 print:text-black">{bracket.bracket}</td>
                              <td className="text-right text-slate-600 dark:text-slate-400 print:text-black">
                                ${bracket.taxableAmount.toFixed(2)}
                              </td>
                              <td className="text-right font-medium text-slate-900 dark:text-slate-100 print:text-black">
                                ${bracket.tax.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {comparison && (
              <div className="space-y-6">
                {/* Recommendation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md print:bg-white print:border print:border-black">
                  <p className="font-medium text-blue-700 dark:text-blue-300 print:text-black">
                    {comparison.recommendation}
                  </p>
                </div>

                {/* Comparison Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => typeof value === 'number' ? `$${value.toFixed(2)}` : String(value)}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <Legend />
                      <Bar dataKey="Net Proceeds" fill="#22c55e" />
                      <Bar dataKey="Tax" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 print:border-black">
                        <th className="text-left py-2 text-slate-700 dark:text-slate-300 print:text-black">Scenario</th>
                        <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Proceeds</th>
                        <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Tax</th>
                        <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Net</th>
                        <th className="text-right py-2 text-slate-700 dark:text-slate-300 print:text-black">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.comparison.map((scenario, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 print:border-black">
                          <td className="py-2 text-slate-900 dark:text-slate-100 print:text-black">{scenario.name}</td>
                          <td className="text-right text-slate-600 dark:text-slate-400 print:text-black">
                            ${scenario.proceeds.toFixed(2)}
                          </td>
                          <td className="text-right text-red-600 dark:text-red-400 print:text-black">
                            ${scenario.totalTax.toFixed(2)}
                          </td>
                          <td className="text-right font-medium text-green-600 dark:text-green-400 print:text-black">
                            ${scenario.netProceeds.toFixed(2)}
                          </td>
                          <td className="text-right text-slate-600 dark:text-slate-400 print:text-black">
                            {(scenario.effectiveRate * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Optimal Sell Schedule */}
                <div className="border-t border-slate-200 dark:border-slate-700 print:border-black pt-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 print:text-black mb-3">Optimal Sell Schedule</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md print:bg-white print:border print:border-black">
                    <p className="text-sm text-green-700 dark:text-green-300 print:text-black">
                      <strong>Recommendation:</strong> Consider waiting 1 year from vest date to qualify for long-term
                      capital gains treatment, which could reduce your tax rate from ordinary income rates (up to 37%) to
                      preferential long-term rates (0%, 15%, or 20%).
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 print:text-black">
                      For {shares} shares at ${vestPrice} vest price, selling at ${sellPrice} could save approximately
                      ${((Number(sellPrice) - Number(vestPrice)) * Number(shares) * 0.15).toFixed(2)} in taxes if held
                      long-term (assuming 15% LTCG rate vs. ordinary income rate).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!result && !comparison && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 print:text-black">
                <p>Enter your details and click Calculate to see your tax breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Export & Print Section */}
        {(result || comparison) && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 print:bg-white print:shadow-none print:border print:border-black">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 print:text-black">
              Export & Print
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.print()}
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-md transition-colors print:bg-black print:text-white print:border print:border-black"
              >
                Print / Save as PDF
              </button>
              <div className="flex-1 flex items-center justify-end print:hidden">
                <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
                  Need professional export for your tax preparer?
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Get Premium Export - $9
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400 print:text-black">
          <p className="mb-2">
            Built with 2025 IRS tax brackets. Updated annually for tax law changes.
          </p>
          <p>
            Open source on GitHub —{' '}
            <a
              href="https://github.com/eylulsenakumral/rsu-tax-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 print:text-black"
            >
              View Source Code
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
