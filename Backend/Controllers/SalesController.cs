using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesStockReporting.Models;
using SalesStockReporting.Services;


namespace SalesStockReporting.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISalesService _salesService;
        private object _logger;

        public SalesController(ISalesService salesService)
        {
            _salesService = salesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var sales = await _salesService.GetAllSales(page, pageSize);
            var totalCount = await _salesService.GetTotalSalesCount();

            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Page", page.ToString());
            Response.Headers.Add("X-Page-Size", pageSize.ToString());

            return Ok(sales);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sale = await _salesService.GetSaleById(id);
            if (sale == null)
            {
                return NotFound();
            }
            return Ok(sale);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaleCreateDto saleDto)
        {
            try
            {
                var sale = new Sale
                {
                    ProductId = saleDto.ProductId,
                    QuantitySold = saleDto.QuantitySold
                };

                var createdSale = await _salesService.CreateSale(sale);
                return CreatedAtAction(nameof(GetById), new { id = createdSale.Id }, createdSale);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { Message = "Internal server error" });
            }
        }
        public class SaleCreateDto
        {
            [Required]
            public int ProductId { get; set; }

            [Required]
            [Range(1, int.MaxValue)]
            public int QuantitySold { get; set; }
        }
    }
}
