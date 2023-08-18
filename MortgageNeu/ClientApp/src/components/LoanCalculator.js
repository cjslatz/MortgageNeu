import React, { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

    const columns = [
        { field: 'month', headerName: 'Month', width: 100 },
        { field: 'remainingBalance', headerName: 'Principal Remaining', width: 200 },
        { field: 'interestPaid', headerName: 'Interest Paid', width: 150 },
        { field: 'principalPaid', headerName: 'Principal Paid', width: 150 },
        { field: 'totalMonthlyPayment', headerName: 'Total Monthly Payment', width: 200 },
    ];

    const amortizationDataWithKeys = amortizationData.map(record => ({
        ...record,
        id: record.month, // Use 'month' as the unique key
    }));


    return (
        <Box p={4}>
            <h2 style={{ marginBottom: '1.5rem' }}>Loan Amortization Calculator</h2>
            <Box display="flex" alignItems="center" marginBottom="1rem">
                <TextField
                    label="Total Loan Amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Box width="1rem" />
                <TextField
                    label="Loan Length in Years"
                    type="number"
                    value={loanLength}
                    onChange={(e) => setLoanLength(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Box width="1rem" />
                <TextField
                    label="Interest Rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Box width="1rem" />
            </Box>
            <Button variant="contained" onClick={calculateAmortization} color="primary" fullWidth>
                Calculate
            </Button>

            <div style={{ height: 400, width: '100%', marginTop: '1.5rem' }}>
                <DataGrid rows={amortizationDataWithKeys} columns={columns} pageSize={10} />
            </div>
        </Box>
    );
}

export default LoanCalculator;
