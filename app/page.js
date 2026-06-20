"use client";

import { useState, useMemo } from "react";

export default function EMICalculator() {
  // --- State Hooks ---
  const [loanAmount, setLoanAmount] = useState(10000); // Default ₹10 thousand
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
  const [tenureYears, setTenureYears] = useState(1);    // Default 1 Year
  const [tenureMonths, setTenureMonths] = useState(0);    // Default 0 Months
  const [isScheduleOpen, setIsScheduleOpen] = useState(false); // Collapsible table state

  // --- Helper Functions ---
  const formatCurrency = (value, decimals = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const convertToIndianWords = (num) => {
    if (num < 1000) return "";
    if (num < 100000) {
      const k = num / 1000;
      return `${k.toFixed(2).replace(/\.00$/, "")} Thousands`;
    }
    if (num >= 10000000) {
      const cr = num / 10000000;
      return `${cr.toFixed(2).replace(/\.00$/, "")} Crores`;
    } else {
      const lakh = num / 100000;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakhs`;
    }
  };

  // --- Calculations ---
  const calculations = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const r = interestRate / 12 / 100; // monthly rate
    const n = tenureYears * 12 + tenureMonths; // total months

    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (n > 0) {
      if (r === 0) {
        emi = P / n;
      } else {
        // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      totalPayment = emi * n;
      totalInterest = Math.max(0, totalPayment - P);
    }

    // Stacked bar percentages
    const total = P + totalInterest;
    const principalPercent = total > 0 ? (P / total) * 100 : 0;
    const interestPercent = total > 0 ? (totalInterest / total) * 100 : 0;

    // Amortization Schedule
    const schedule = [];
    if (n > 0) {
      let balance = P;
      for (let i = 1; i <= n; i++) {
        const interestComponent = balance * r;
        let principalComponent = emi - interestComponent;

        // Rounding adjust for the last month or if principal exceeds remaining balance
        if (i === n || principalComponent > balance) {
          principalComponent = balance;
        }

        const remainingBalance = Math.max(0, balance - principalComponent);
        const actualEmi = principalComponent + interestComponent;

        schedule.push({
          month: i,
          emi: actualEmi,
          principal: principalComponent,
          interest: interestComponent,
          balance: remainingBalance,
        });

        balance = remainingBalance;
        if (balance <= 0) break;
      }
    }

    return {
      emi,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
      schedule,
      totalMonths: n,
    };
  }, [loanAmount, interestRate, tenureYears, tenureMonths]);

  // --- Direct Input Handlers ---
  const handleLoanAmountChange = (val) => {
    const parsed = parseFloat(val);
    setLoanAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handleInterestRateChange = (val) => {
    const parsed = parseFloat(val);
    setInterestRate(isNaN(parsed) ? 0 : parsed);
  };

  const handleYearsChange = (val) => {
    const parsed = parseInt(val, 10);
    setTenureYears(isNaN(parsed) ? 0 : parsed);
  };

  const handleMonthsChange = (val) => {
    const parsed = parseInt(val, 10);
    setTenureMonths(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#FAF7F2]">
            EMI Calculator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Calculate your monthly home, car, or personal loan installments instantly.
          </p>
        </div>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-md text-[#0F1729] bg-[#FAF7F2] hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1729] focus:ring-[#FAF7F2] transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
        >
          Built for Digital Heroes
        </a>
      </header>

      {/* Main Grid Layout */}
      <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Inputs Panel */}
        <section className="lg:col-span-7 bg-[#FAF7F2] text-[#0F1729] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-slate-200 pb-3">
            Loan Parameters
          </h2>

          {/* Input 1: Loan Amount */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="loan-amount-input" className="text-sm font-bold text-slate-700">
                Loan Amount (₹)
              </label>
              {loanAmount >= 10000 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {convertToIndianWords(loanAmount)}
                </span>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <input
                id="loan-amount-input"
                type="number"
                min="0"
                max="100000000"
                step="1000"
                value={loanAmount || ""}
                onChange={(e) => handleLoanAmountChange(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-[#1A7F5A] focus:border-[#1A7F5A] outline-none transition-all shadow-sm"
                aria-label="Loan Amount in Rupees"
              />
              <span className="hidden sm:inline text-xs text-slate-400 font-mono">
                Min: 10K | Max: 10Cr
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-[#1A7F5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7F5A]"
              aria-label="Loan Amount Range Slider"
            />
          </div>

          {/* Input 2: Interest Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="interest-rate-input" className="text-sm font-bold text-slate-700">
                Annual Interest Rate (%)
              </label>
            </div>
            <div className="flex gap-4 items-center">
              <input
                id="interest-rate-input"
                type="number"
                min="0"
                max="30"
                step="0.01"
                value={interestRate || ""}
                onChange={(e) => handleInterestRateChange(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none transition-all shadow-sm"
                aria-label="Annual Interest Rate Percentage"
              />
              <span className="hidden sm:inline text-xs text-slate-400 font-mono">
                Min: 1% | Max: 30%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-[#D97706] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
              aria-label="Interest Rate Range Slider"
            />
          </div>

          {/* Input 3: Tenure (Years & Months) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Years */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tenure-years-input" className="text-sm font-bold text-slate-700">
                Tenure (Years)
              </label>
              <div className="flex gap-4 items-center">
                <input
                  id="tenure-years-input"
                  type="number"
                  min="0"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => handleYearsChange(e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-[#0F1729] focus:border-[#0F1729] outline-none transition-all shadow-sm"
                  aria-label="Loan Tenure in Years"
                />
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-[#0F1729] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1729]"
                aria-label="Tenure Years Slider"
              />
            </div>

            {/* Months */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tenure-months-input" className="text-sm font-bold text-slate-700">
                Tenure (Months)
              </label>
              <div className="flex gap-4 items-center">
                <input
                  id="tenure-months-input"
                  type="number"
                  min="0"
                  max="11"
                  step="1"
                  value={tenureMonths}
                  onChange={(e) => handleMonthsChange(e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-[#0F1729] focus:border-[#0F1729] outline-none transition-all shadow-sm"
                  aria-label="Loan Tenure in Months"
                />
              </div>
              <input
                type="range"
                min="0"
                max="11"
                step="1"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-[#0F1729] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1729]"
                aria-label="Tenure Months Slider"
              />
            </div>
          </div>

          {/* Validation Help Alert */}
          {calculations.totalMonths === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
              Please specify a loan tenure greater than 0 months.
            </div>
          )}
        </section>

        {/* Right Side: Results Display Panel */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Card with results */}
          <div className="bg-[#FAF7F2] text-[#0F1729] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tight border-b border-slate-200 pb-3">
              Calculation Summary
            </h2>

            {/* Monthly EMI Large Number */}
            <div className="flex flex-col items-center py-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Monthly EMI
              </span>
              <span className="text-4xl sm:text-5xl font-sans font-extrabold text-[#0F1729] mt-2 tracking-tight break-all px-2">
                {calculations.totalMonths > 0 ? formatCurrency(calculations.emi, 2) : "₹0.00"}
              </span>
            </div>

            {/* Total Payments Breakdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <span className="text-xs font-bold text-slate-500">Principal Loan Amount</span>
                <span className="text-lg font-bold font-mono text-[#1A7F5A] mt-1">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <div className="flex flex-col p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                <span className="text-xs font-bold text-slate-500">Total Interest Payable</span>
                <span className="text-lg font-bold font-mono text-[#D97706] mt-1">
                  {formatCurrency(calculations.totalInterest)}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-slate-100/70 rounded-lg border border-slate-200/50">
              <span className="text-xs font-bold text-slate-500">Total Payment (Principal + Interest)</span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {formatCurrency(calculations.totalPayment)}
              </span>
            </div>

            {/* Ratio Stacked Bar */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Principal vs Interest Ratio</span>
                <span>{calculations.totalMonths > 0 ? `${calculations.totalMonths} payments` : "0 payments"}</span>
              </div>

              {/* Stacked Segmented Bar */}
              <div className="h-6 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                {calculations.totalPayment > 0 ? (
                  <>
                    <div
                      style={{ width: `${calculations.principalPercent}%` }}
                      className="bg-[#1A7F5A] transition-all duration-300 ease-out h-full"
                      role="progressbar"
                      aria-valuenow={calculations.principalPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Principal Portion Percentage"
                      title={`Principal: ${calculations.principalPercent.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${calculations.interestPercent}%` }}
                      className="bg-[#D97706] transition-all duration-300 ease-out h-full"
                      role="progressbar"
                      aria-valuenow={calculations.interestPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Interest Portion Percentage"
                      title={`Interest: ${calculations.interestPercent.toFixed(1)}%`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-slate-200 h-full" />
                )}
              </div>

              {/* Legends */}
              <div className="flex justify-between items-center mt-1 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-3 h-3 rounded bg-[#1A7F5A]" />
                  <span>Principal: {calculations.principalPercent.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-800">
                  <span className="w-3 h-3 rounded bg-[#D97706]" />
                  <span>Interest: {calculations.interestPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Amortization Schedule Section */}
      <section className="mt-8 bg-[#FAF7F2] text-[#0F1729] rounded-2xl shadow-xl overflow-hidden">
        <button
          onClick={() => setIsScheduleOpen(!isScheduleOpen)}
          className="w-full px-6 py-4 flex items-center justify-between font-bold text-left bg-slate-50 hover:bg-slate-100 border-b border-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0F1729] transition-all"
          aria-expanded={isScheduleOpen}
          aria-controls="amortization-schedule-table"
        >
          <span className="text-lg flex items-center gap-2">
            <span>Amortization Schedule</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-mono">
              {calculations.totalMonths} {calculations.totalMonths === 1 ? "Month" : "Months"}
            </span>
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {isScheduleOpen ? "Hide Schedule ▲" : "Show Month-wise Schedule ▼"}
          </span>
        </button>

        {isScheduleOpen && (
          <div
            id="amortization-schedule-table"
            className="overflow-x-auto max-h-96 overflow-y-auto"
          >
            {calculations.schedule.length > 0 ? (
              <table className="min-w-full text-left font-mono border-collapse text-sm">
                <thead className="bg-[#0F1729] text-[#FAF7F2] sticky top-0 text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Month</th>
                    <th scope="col" className="px-6 py-3 font-semibold">EMI</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Principal Component</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Interest Component</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {calculations.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-500">#{row.month}</td>
                      <td className="px-6 py-3.5 text-slate-900">{formatCurrency(row.emi)}</td>
                      <td className="px-6 py-3.5 text-emerald-700 font-semibold">{formatCurrency(row.principal)}</td>
                      <td className="px-6 py-3.5 text-amber-700 font-semibold">{formatCurrency(row.interest)}</td>
                      <td className="px-6 py-3.5 text-slate-600 font-semibold">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm font-semibold">
                No active schedule. Please set a tenure and loan amount above.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-semibold text-slate-300">
            Developer Portfolio & Contact
          </p>
          <p className="flex items-center gap-1.5">
            <span className="font-bold text-[#FAF7F2]">Muzahir Ali</span>
            <span>•</span>
            <a
              href="mailto:muzahirraza509@gmail.com"
              className="underline hover:text-white transition-colors"
            >
              muzahirraza509@gmail.com
            </a>
          </p>
        </div>
        <div className="text-center md:text-right">
          <p>© {new Date().getFullYear()} EMI Calculator. All client-side computations. No logs recorded.</p>
        </div>
      </footer>
    </div>
  );
}
