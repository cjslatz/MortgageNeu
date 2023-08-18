﻿using Microsoft.AspNetCore.Mvc;
namespace MortgageNeu.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AmortizationController : ControllerBase
    {
        [HttpPost]
        public ActionResult<List<AmortizationRecord>> CalculateAmortization([FromBody] LoanDetails loanDetails)
        {
            // Extract loan details from the request
            double totalLoanAmount = loanDetails.TotalLoanAmount;
            int loanLengthYears = loanDetails.LoanLengthYears;
            double annualInterestRate = loanDetails.InterestRate;

            // Perform amortization calculation
            List<AmortizationRecord> amortizationSchedule = new List<AmortizationRecord>();
            int loanLengthMonths = loanLengthYears * 12;
            double monthlyInterestRate = annualInterestRate;

            // Need to enforce something on the front end to know if this makes sense
            if (annualInterestRate >= 1)
            {
                monthlyInterestRate = (annualInterestRate / 100) / 12;
            }

            double remainingBalance = totalLoanAmount;
            double monthlyPayment = CalculateMonthlyPayment(totalLoanAmount, loanLengthMonths, monthlyInterestRate);
            for (int month = 1; month <= loanLengthMonths; month++)
            {
                double interestPayment = remainingBalance * monthlyInterestRate;
                double principalPayment = monthlyPayment - interestPayment;

                remainingBalance -= principalPayment;

                AmortizationRecord record = new AmortizationRecord
                {
                    Month = month,
                    RemainingBalance = remainingBalance,
                    InterestPaid = interestPayment,
                    PrincipalPaid = principalPayment,
                    TotalMonthlyPayment = interestPayment + principalPayment
                };

                amortizationSchedule.Add(record);
            }

            return Ok(amortizationSchedule);
        }

        private double CalculateMonthlyPayment(double loanAmount, int loanLengthMonths, double monthlyInterestRate)
        {
            var top = Math.Pow(1+monthlyInterestRate, loanLengthMonths);
            var bottom = (Math.Pow(1+monthlyInterestRate, loanLengthMonths) - 1);
            var total = loanAmount * monthlyInterestRate * (top/bottom);

            return total;
        }
    }



    public class LoanDetails
    {
        public double TotalLoanAmount { get; set; }
        public int LoanLengthYears { get; set; }
        public double InterestRate { get; set; }
    }

    public class AmortizationRecord
    {
        public int Month { get; set; }
        public double RemainingBalance { get; set; }
        public double InterestPaid { get; set; }
        public double PrincipalPaid { get; set; }
        public double TotalMonthlyPayment { get; set; }
    }
}

