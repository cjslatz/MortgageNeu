import React, { useState } from 'react';

function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanLength, setLoanLength] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [amortizationData, setAmortizationData] = useState([]);

    const calculateAmortization = async () => {
        const response = await fetch('/amortization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TotalLoanAmount: parseFloat(loanAmount),
                LoanLengthYears: parseInt(loanLength),
                InterestRate: parseFloat(interestRate)
            })
        });

        if (response.ok) {
            const data = await response.json();
            setAmortizationData(data);
        } else {
            console.error('Error calculating amortization');
        }
    };

    return (
        <div>
            <h2>Loan Amortization Calculator</h2>
            <div>
                <label>Total Loan Amount:</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
            </div>
            <div>
                <label>Loan Length in Years:</label>
                <input type="number" value={loanLength} onChange={(e) => setLoanLength(e.target.value)} />
            </div>
            <div>
                <label>Interest Rate:</label>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            </div>
            <button onClick={calculateAmortization}>Calculate</button>

            {/* Display amortization data here */}
            {/* You can use a table or any other preferred layout */}
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Principal Remaining</th>
                        <th>Interest Paid</th>
                        <th>Principal Paid</th>
                        <th>Total Monthly Payment</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through amortizationData and render rows */}
                </tbody>
            </table>
        </div>
    );
}

export default LoanCalculator;
