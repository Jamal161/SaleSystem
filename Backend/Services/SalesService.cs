
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesStockReporting.Data;
using SalesStockReporting.Models;

namespace SalesStockReporting.Services
{
    public interface ISalesService
    {
        Task<IEnumerable<Sale>> GetAllSales(int page = 1, int pageSize = 10);
        Task<Sale> GetSaleById(int id);
        Task<Sale> CreateSale(Sale sale);
        Task<int> GetTotalSalesCount();
    }
    public class SalesService : ISalesService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SalesService> _logger;

        public SalesService(ApplicationDbContext context, ILogger<SalesService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Sale>> GetAllSales(int page = 1, int pageSize = 10)
        {
            try
            {
                return await _context.Sales
                    .Include(s => s.Product)
                    .OrderByDescending(s => s.SaleDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sales");
                throw;
            }
        }

        public async Task<Sale> GetSaleById(int id)
        {
            try
            {
                return await _context.Sales
                    .Include(s => s.Product)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving sale with ID {id}");
                throw;
            }
        }

        public async Task<Sale> CreateSale(Sale sale)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == sale.ProductId);

                if (product == null)
                {
                    throw new ArgumentException($"Product with ID {sale.ProductId} not found");
                }

            
                if (sale.QuantitySold <= 0)
                {
                    throw new ArgumentException("Quantity must be greater than 0");
                }

               
                if (product.StockQty < sale.QuantitySold)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock. Available: {product.StockQty}, Requested: {sale.QuantitySold}");
                }

               
                sale.TotalPrice = product.Price * sale.QuantitySold;
                sale.SaleDate = DateTime.UtcNow;

                
                product.StockQty -= sale.QuantitySold;
                _context.Products.Update(product);

                
                await _context.Sales.AddAsync(sale);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                
                return await _context.Sales
                    .Include(s => s.Product)
                    .FirstOrDefaultAsync(s => s.Id == sale.Id);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating sale");
                throw; 
            }
        }

        public async Task<int> GetTotalSalesCount()
        {
            try
            {
                return await _context.Sales.CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sales count");
                throw;
            }
        }
    }
}