import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanLength, setLoanLength] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [amortizationData, setAmortizationData] = useState([]);

    const [loanAmountValid, setLoanAmountValid] = useState(true);
    const [loanLengthValid, setLoanLengthValid] = useState(true);
    const [interestRateValid, setInterestRateValid] = useState(true);

    const calculateAmortization = async () => {
        
        const response = await fetch('/amortization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TotalLoanAmount: parseFloat(loanAmount),
                LoanLengthMonths: parseInt(loanLength),
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

    // Validation functions for each input field
    const validateLoanAmount = (value) => {
        const isValid = /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0;
        setLoanAmountValid(isValid);
    };

    const validateLoanLength = (value) => {
        const isValid = /^\d{1,5}$/.test(value) && parseInt(value) > 0;
        setLoanLengthValid(isValid);
    };

    const validateInterestRate = (value) => {
        const isValid = /^(\d+(\.\d*)?|\.\d+)?$/.test(value) && parseFloat(value) >= 0;
        setInterestRateValid(isValid);
    };

    const columns = [
        { field: 'month', headerName: 'Month', flex: 1 },
        {
            field: 'remainingBalance',
            headerName: 'Principal Remaining',
            flex: 1,
            valueFormatter: (params) => {
                return params.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });
            } },
        {
            field: 'interestPaid', headerName: 'Interest Paid', flex: 1, valueFormatter: (params) => {
                return params.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });
            }
        },
        {
            field: 'principalPaid', headerName: 'Principal Paid', flex: 1, valueFormatter: (params) => {
                return params.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });
            } },
        {
            field: 'totalMonthlyPayment', headerName: 'Total Monthly Payment', flex: 1, valueFormatter: (params) => {
                return params.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });
            } },
    ];

    const amortizationDataWithKeys = amortizationData.map(record => ({
        ...record,
        id: record.month, // Use 'month' as the unique key
    }));


    return (
        <Box p={4}>
            <h2 style={{ marginBottom: '1.5rem' }}>Loan Amortization Calculator</h2>
            <Box display="flex" alignItems="center" marginBottom="1.5rem">
                <TextField
                    label="Total Loan Amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => {
                        setLoanAmount(e.target.value);
                        validateLoanAmount(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    error={!loanAmountValid}
                    helperText={!loanAmountValid ? 'Please enter a positive number' : ''}
                />
                <Box width="1rem" />
                <TextField
                    label="Loan Length in Months"
                    type="number"
                    value={loanLength}
                    onChange={(e) => {
                        setLoanLength(e.target.value);
                        validateLoanLength(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                        step: 1,
                        min: 1,
                    }}
                    error={!loanLengthValid}
                    helperText={!loanLengthValid ? 'Please enter a positive integer, no greater than 99999' : ''}
                />
                <Box width="1rem" />
                <TextField
                    label="Interest Rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                        setInterestRate(e.target.value);
                        validateInterestRate(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    error={!interestRateValid}
                    helperText={!interestRateValid ? 'Please enter a positive number' : ''}
                />
                <Box width="1rem" />
            </Box>
            <Button
                variant="contained"
                onClick={calculateAmortization}
                color="primary"
                fullWidth
                disabled={!loanAmountValid || !loanLengthValid || !interestRateValid}
            >
                Calculate
            </Button>

            <div style={{ height: 400, width: '100%', marginTop: '1.5rem' }}>
                <DataGrid rows={amortizationDataWithKeys} columns={columns} pageSize={10} disableRowSelectionOnClick={true} />
            </div>
        </Box>
    );
}

export default LoanCalculator;
