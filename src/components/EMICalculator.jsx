/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - REDUCING BALANCE EMI CALCULATOR
   ========================================================================== */

import React, { useState, useMemo } from 'react';
import { Calculator, IndianRupee, PieChart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function EMICalculator({ defaultAmount = 4000000, propertyTitle = '' }) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount);
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% annual
  const [tenureYears, setTenureYears] = useState(20);

  // Reducing Balance EMI Calculation Formula
  const { monthlyEmi, totalInterest, totalPayment, principalPercentage, interestPercentage } = useMemo(() => {
    const P = Math.max(0, Number(loanAmount));
    const annualRate = Math.max(0, Number(interestRate));
    const r = annualRate / 12 / 100;
    const n = Math.max(1, Number(tenureYears) * 12);

    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalAmt = emi * n;
    const totInt = Math.max(0, totalAmt - P);

    const princPct = totalAmt > 0 ? ((P / totalAmt) * 100).toFixed(1) : 100;
    const intPct = totalAmt > 0 ? ((totInt / totalAmt) * 100).toFixed(1) : 0;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totInt),
      totalPayment: Math.round(totalAmt),
      principalPercentage: princPct,
      interestPercentage: intPct
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatINR = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  return (
    <div
      className="card emi-calculator-card"
      style={{
        padding: 'clamp(1.2rem, 3.5vw, 2rem)',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', minWidth: 0 }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--turquoise-light)',
            color: 'var(--primary-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Calculator size={22} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.3rem)', color: 'var(--deep-teal)', margin: 0, wordBreak: 'break-word', lineHeight: 1.3 }}>
            Home Loan EMI Calculator
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0', wordBreak: 'break-word' }}>
            {propertyTitle ? `Estimate monthly payments for ${propertyTitle}` : 'Calculate your monthly loan repayment & interest'}
          </p>
        </div>
      </div>

      <div className="emi-calculator-grid">
        {/* Controls Column */}
        <div className="emi-controls-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
          {/* Loan Amount */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div className="emi-control-header">
              <label className="form-label" style={{ marginBottom: 0 }}>Loan Amount</label>
              <div className="emi-value-badge">
                {formatINR(loanAmount)}
              </div>
            </div>
            <div className="emi-slider-wrap">
              <input
                type="range"
                min="500000"
                max="20000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                aria-label="Loan Amount Slider"
                className="emi-slider"
              />
            </div>
            <div className="emi-slider-scale">
              <span>₹5 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹2 Crores</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div className="emi-control-header">
              <label className="form-label" style={{ marginBottom: 0 }}>Interest Rate (% P.A.)</label>
              <div className="emi-value-badge">
                {interestRate}%
              </div>
            </div>
            <div className="emi-slider-wrap">
              <input
                type="range"
                min="7.5"
                max="15.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                aria-label="Interest Rate Slider"
                className="emi-slider"
              />
            </div>
            <div className="emi-slider-scale">
              <span>7.5% (SBI / HDFC)</span>
              <span>10.0%</span>
              <span>15.0%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div className="emi-control-header">
              <label className="form-label" style={{ marginBottom: 0 }}>Tenure (Years)</label>
              <div className="emi-value-badge">
                {tenureYears} Years ({tenureYears * 12} Months)
              </div>
            </div>
            <div className="emi-slider-wrap">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                aria-label="Loan Tenure Slider"
                className="emi-slider"
              />
            </div>
            <div className="emi-slider-scale">
              <span>5 Years</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="emi-results-card">
          <div style={{ width: '100%', minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Monthly EMI
            </div>
            <div className="emi-monthly-amount">
              {formatINR(monthlyEmi)}
              <span className="emi-month-suffix"> / month</span>
            </div>
          </div>

          {/* Breakdown summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', width: '100%', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Principal Amount:</span>
              <strong style={{ color: 'var(--text-heading)' }}>{formatINR(loanAmount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Interest Payable:</span>
              <strong style={{ color: '#D97706' }}>{formatINR(totalInterest)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.95rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Total Payment:</span>
              <strong style={{ fontWeight: 800, color: 'var(--primary-teal)' }}>{formatINR(totalPayment)}</strong>
            </div>
          </div>

          {/* Visual Progress Bar Breakdown */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 600 }}>
              <span style={{ color: 'var(--primary-teal)' }}>Principal ({principalPercentage}%)</span>
              <span style={{ color: '#D97706' }}>Interest ({interestPercentage}%)</span>
            </div>
            <div style={{ height: '10px', width: '100%', backgroundColor: '#D97706', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${principalPercentage}%`, backgroundColor: 'var(--primary-teal)', height: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, wordBreak: 'break-word', width: '100%', minWidth: 0 }}>
            <ShieldCheck size={16} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Pre-approved bank loans available up to 90% for our projects</span>
          </div>
        </div>
      </div>

      <style>{`
        .emi-calculator-card {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
          overflow: hidden;
        }
        .emi-calculator-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .emi-control-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
          width: 100%;
          min-width: 0;
        }
        .emi-value-badge {
          font-weight: 800;
          color: var(--deep-teal);
          background-color: var(--turquoise-light);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: clamp(0.82rem, 3.2vw, 0.95rem);
          max-width: 100%;
          word-break: break-word;
          white-space: normal;
        }
        .emi-slider-wrap {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 2px 0;
          overflow: visible;
        }
        .emi-slider {
          width: 100%;
          max-width: 100%;
          display: block;
          accent-color: var(--primary-teal);
          cursor: pointer;
          margin: 0;
          touch-action: pan-y;
          height: 28px;
        }
        .emi-slider-scale {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.25rem 0.5rem;
          font-size: clamp(0.7rem, 2.5vw, 0.75rem);
          color: var(--text-muted);
          margin-top: 4px;
          width: 100%;
        }
        .emi-slider-scale span {
          white-space: normal;
          word-break: break-word;
        }
        .emi-results-card {
          background: linear-gradient(145deg, #F5FAF9 0%, #E6FAF7 100%);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: clamp(1.15rem, 3vw, 1.75rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .emi-monthly-amount {
          font-size: clamp(1.65rem, 5.5vw, 2.3rem);
          font-weight: 800;
          color: var(--deep-teal);
          font-family: var(--font-display);
          margin-top: 4px;
          line-height: 1.2;
          word-break: break-word;
        }
        .emi-month-suffix {
          font-size: clamp(0.85rem, 3vw, 0.95rem);
          font-weight: 500;
          color: var(--text-secondary);
        }
        @media (max-width: 860px) {
          .emi-calculator-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .emi-control-header {
            flex-direction: row;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
