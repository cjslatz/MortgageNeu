using Microsoft.AspNetCore.Mvc;
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
            int loanLengthMonths = loanDetails.LoanLengthMonths;
            double annualInterestRate = loanDetails.InterestRate;

            // Perform amortization calculation
            List<AmortizationRecord> amortizationSchedule = new List<AmortizationRecord>();
            double monthlyInterestRate = annualInterestRate;

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
                    RemainingBalance = Math.Round(remainingBalance,2),
                    InterestPaid = Math.Round(interestPayment, 2),
                    PrincipalPaid = Math.Round(principalPayment, 2),
                    TotalMonthlyPayment = Math.Round(interestPayment + principalPayment, 2)
                };

                amortizationSchedule.Add(record);
            }

            return Ok(amortizationSchedule);
        }

        private double CalculateMonthlyPayment(double loanAmount, int loanLengthMonths, double monthlyInterestRate)
        {
            // Split up for readability
            var top = Math.Pow(1 + monthlyInterestRate, loanLengthMonths);
            var bottom = (Math.Pow(1 + monthlyInterestRate, loanLengthMonths) - 1);
            var total = loanAmount * monthlyInterestRate * (top/bottom);

            return total;
        }
    }



    public class LoanDetails
    {
        public double TotalLoanAmount { get; set; }
        public int LoanLengthMonths { get; set; }
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

