using Microsoft.AspNetCore.Mvc;
using MortgageNeu.Controllers;
using Moq;
using Microsoft.Extensions.Logging;

namespace MortgageNeu.Tests
{
    [TestClass]
    public class AmortizationControllerTests
    {
        private readonly Mock<ILogger<AmortizationController>> _loggerMock = new Mock<ILogger<AmortizationController>>();

        [TestMethod]
        public void CalculateAmortization_Returns_OkResult()
        {
            // Arrange
            var controller = new AmortizationController(_loggerMock.Object);

            // Act
            var loanDetails = new LoanDetails
            {
                TotalLoanAmount = 100000,
                LoanLengthMonths = 360,
                InterestRate = 5.0
            };
            var result = controller.CalculateAmortization(loanDetails);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<List<AmortizationRecord>>));
        }

        [TestMethod]
        public void CalculateMonthlyPayment_Calculates_Correctly()
        {
            // Arrange
            var controller = new AmortizationController(_loggerMock.Object);
            var loanAmount = 100000;
            var loanLengthMonths = 360;
            var monthlyInterestRate = 0.0041667; // 5% annual interest rate

            // Act
            var monthlyPayment = controller.CalculateMonthlyPayment(loanAmount, loanLengthMonths, monthlyInterestRate);

            // Assert
            Assert.AreEqual(536.82, monthlyPayment, 0.01); // Tolerance of 0.01 (2 decimal places)
        }
    }
}