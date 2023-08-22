using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MortgageNeu.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AmortizationController : ControllerBase
    {
        private readonly ILogger<AmortizationController> _logger;

        public AmortizationController(ILogger<AmortizationController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public ActionResult<List<AmortizationRecord>> CalculateAmortization([FromBody] LoanDetails loanDetails)
        {
            try
            {
                double totalLoanAmount = loanDetails.TotalLoanAmount;
                int loanLengthMonths = loanDetails.LoanLengthMonths;
                double annualInterestRate = loanDetails.InterestRate;

                _logger.LogInformation("Recieved new calculation request");

                List<AmortizationRecord> amortizationSchedule = new List<AmortizationRecord>();
                double monthlyInterestRate = annualInterestRate;

                // User enters interest rate as 5.5% not .055 (assumption)
                monthlyInterestRate = (annualInterestRate / 100) / 12;

                double remainingBalance = totalLoanAmount;
                double monthlyPayment = CalculateMonthlyPayment(totalLoanAmount, loanLengthMonths, monthlyInterestRate);
                for (int month = 1; month <= loanLengthMonths; month++)
                {
                    double interestPayment = remainingBalance * monthlyInterestRate;
                    double principalPayment = monthlyPayment - interestPayment;

                    remainingBalance -= principalPayment;

                    // Due to double accuaracy some loans end on a very tiny negative number, I don't want the negative ($-0.00) in the grid
                    remainingBalance = Math.Max(remainingBalance, 0.0);

                    AmortizationRecord record = new AmortizationRecord
                    {
                        Month = month,
                        RemainingBalance = Math.Round(remainingBalance, 2),
                        InterestPaid = Math.Round(interestPayment, 2),
                        PrincipalPaid = Math.Round(principalPayment, 2),
                        TotalMonthlyPayment = Math.Round(interestPayment + principalPayment, 2)
                    };

                    amortizationSchedule.Add(record);
                }

                return Ok(amortizationSchedule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occured during amortization calculation. Error message {ex.Message}");
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        public double CalculateMonthlyPayment(double loanAmount, int loanLengthMonths, double monthlyInterestRate)
        {
            // Split up for readability
            var numerator = Math.Pow(1 + monthlyInterestRate, loanLengthMonths);
            var denominator = (Math.Pow(1 + monthlyInterestRate, loanLengthMonths) - 1);
            var monthlyPayment = loanAmount * monthlyInterestRate * (numerator/denominator);

            return monthlyPayment;
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

