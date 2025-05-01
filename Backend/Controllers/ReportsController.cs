using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesStockReporting.Services;


namespace SalesStockReporting.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportingService _reportingService;

        public ReportsController(IReportingService reportingService)
        {
            _reportingService = reportingService;
        }

        [HttpGet("current-stock")]
        public async Task<IActionResult> GetCurrentStockReport()
        {
            var report = await _reportingService.GetCurrentStockReport();
            return Ok(report);
        }

        [HttpGet("date-wise-stock")]
        public async Task<IActionResult> GetDateWiseStockReport([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
            {
                return BadRequest("From date cannot be after to date");
            }

            var report = await _reportingService.GetDateWiseStockReport(fromDate, toDate);
            return Ok(report);
        }
    }
}