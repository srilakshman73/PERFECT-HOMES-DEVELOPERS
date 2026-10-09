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
      className="card"
      style={{
        padding: '2rem',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--turquoise-light)',
            color: 'var(--primary-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Calculator size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)' }}>
            Home Loan EMI Calculator
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {propertyTitle ? `Estimate monthly payments for ${propertyTitle}` : 'Calculate your monthly loan repayment & interest'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Loan Amount */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Loan Amount</label>
              <div
                style={{
                  fontWeight: 800,
                  color: 'var(--deep-teal)',
                  backgroundColor: 'var(--turquoise-light)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem'
                }}
              >
                {formatINR(loanAmount)}
              </div>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹5 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹2 Crores</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Interest Rate (% P.A.)</label>
              <div
                style={{
                  fontWeight: 800,
                  color: 'var(--deep-teal)',
                  backgroundColor: 'var(--turquoise-light)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem'
                }}
              >
                {interestRate}%
              </div>
            </div>
            <input
              type="range"
              min="7.5"
              max="15.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>7.5% (SBI / HDFC)</span>
              <span>10.0%</span>
              <span>15.0%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Tenure (Years)</label>
              <div
                style={{
                  fontWeight: 800,
                  color: 'var(--deep-teal)',
                  backgroundColor: 'var(--turquoise-light)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem'
                }}
              >
                {tenureYears} Years ({tenureYears * 12} Months)
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>5 Years</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #F5FAF9 0%, #E6FAF7 100%)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Monthly EMI
            </div>
            <div
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                color: 'var(--deep-teal)',
                fontFamily: 'var(--font-display)',
                marginTop: '4px'
              }}
            >
              {formatINR(monthlyEmi)}
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}> / month</span>
            </div>
          </div>

          {/* Breakdown summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Principal Amount:</span>
              <strong style={{ color: 'var(--text-heading)' }}>{formatINR(loanAmount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Interest Payable:</span>
              <strong style={{ color: '#D97706' }}>{formatINR(totalInterest)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Total Payment:</span>
              <strong style={{ fontWeight: 800, color: 'var(--primary-teal)' }}>{formatINR(totalPayment)}</strong>
            </div>
          </div>

          {/* Visual Progress Bar Breakdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>
              <span style={{ color: 'var(--primary-teal)' }}>Principal ({principalPercentage}%)</span>
              <span style={{ color: '#D97706' }}>Interest ({interestPercentage}%)</span>
            </div>
            <div style={{ height: '10px', width: '100%', backgroundColor: '#D97706', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${principalPercentage}%`, backgroundColor: 'var(--primary-teal)', height: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} color="var(--primary-teal)" />
            <span>Pre-approved bank loans available up to 90% for our projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
