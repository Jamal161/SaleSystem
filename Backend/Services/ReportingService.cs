
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesStockReporting.Data;
using SalesStockReporting.Models;


namespace SalesStockReporting.Services
{
    public interface IReportingService
    {
        Task<IEnumerable<ProductStockReport>> GetCurrentStockReport();
        Task<IEnumerable<DateWiseStockReport>> GetDateWiseStockReport(DateTime fromDate, DateTime toDate);
    }

    public class ReportingService : IReportingService
    {
        private readonly ApplicationDbContext _context;

        public ReportingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductStockReport>> GetCurrentStockReport()
        {
            return await _context.Products
                .Select(p => new ProductStockReport
                {
                    ProductName = p.Name,
                    SKU = p.SKU,
                    Price = p.Price,
                    CurrentStockQuantity = p.StockQty
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<DateWiseStockReport>> GetDateWiseStockReport(DateTime fromDate, DateTime toDate)
        {
            var products = await _context.Products.ToListAsync();
            var salesInPeriod = await _context.Sales
                .Where(s => s.SaleDate >= fromDate && s.SaleDate <= toDate)
                .GroupBy(s => s.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(s => s.QuantitySold)
                })
                .ToListAsync();

            var salesBeforePeriod = await _context.Sales
                .Where(s => s.SaleDate < fromDate)
                .GroupBy(s => s.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(s => s.QuantitySold)
                })
                .ToListAsync();

            var reports = new List<DateWiseStockReport>();

            foreach (var product in products)
            {
                var initialStock = product.StockQty +
                    (salesBeforePeriod.FirstOrDefault(s => s.ProductId == product.Id)?.TotalSold ?? 0) +
                    (salesInPeriod.FirstOrDefault(s => s.ProductId == product.Id)?.TotalSold ?? 0);

                var soldInPeriod = salesInPeriod.FirstOrDefault(s => s.ProductId == product.Id)?.TotalSold ?? 0;

                reports.Add(new DateWiseStockReport
                {
                    ProductName = product.Name,
                    OpeningStock = initialStock - soldInPeriod,
                    TotalSoldQuantity = soldInPeriod,
                    ClosingStock = initialStock - soldInPeriod - soldInPeriod 
                });
            }

            return reports;
        }
    }

    public class ProductStockReport
    {
        public string ProductName { get; set; }
        public string SKU { get; set; }
        public decimal Price { get; set; }
        public int CurrentStockQuantity { get; set; }
    }

    public class DateWiseStockReport
    {
        public string ProductName { get; set; }
        public int OpeningStock { get; set; }
        public int TotalSoldQuantity { get; set; }
        public int ClosingStock { get; set; }
    }
}