import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableRow, TableCell, TableHead, Paper } from '@mui/material';

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
                <TextField label="Total Loan Amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
            </div>
            <div>
                <TextField label="Loan Length in Years" type="number" value={loanLength} onChange={(e) => setLoanLength(e.target.value)} />
            </div>
            <div>
                <TextField label="Interest Rate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            </div>
            <Button variant="contained" onClick={calculateAmortization}>Calculate</Button>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Principal Remaining</TableCell>
                            <TableCell>Interest Paid</TableCell>
                            <TableCell>Principal Paid</TableCell>
                            <TableCell>Total Monthly Payment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {amortizationData.map(record => (
                            <TableRow key={record.month}>
                                <TableCell>{record.month}</TableCell>
                                <TableCell>{record.remainingBalance}</TableCell>
                                <TableCell>{record.interestPaid}</TableCell>
                                <TableCell>{record.principalPaid}</TableCell>
                                <TableCell>{record.totalMonthlyPayment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

export default LoanCalculator;
