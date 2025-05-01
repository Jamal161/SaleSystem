
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesStockReporting.Data;
using SalesStockReporting.Models;


namespace SalesStockReporting.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProducts(int page = 1, int pageSize = 10, string search = "");
        Task<Product> GetProductById(int id);
        Task<Product> CreateProduct(Product product);
        Task<Product> UpdateProduct(int id, Product product);
        Task<bool> DeleteProduct(int id);
        Task<int> GetTotalProductCount(string search = "");
    }

    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProducts(int page = 1, int pageSize = 10, string search = "")
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    (!string.IsNullOrEmpty(p.SKU) && p.SKU.Contains(search)));
            }

            return await query
                .OrderBy(p => p.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Product> GetProductById(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> CreateProduct(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProduct(int id, Product product)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                throw new Exception("Product not found");
            }

            existingProduct.Name = product.Name;
            existingProduct.SKU = product.SKU;
            existingProduct.Price = product.Price;
            existingProduct.StockQty = product.StockQty;
            existingProduct.Description = product.Description;

            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<bool> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            product.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetTotalProductCount(string search = "")
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    (!string.IsNullOrEmpty(p.SKU) && p.SKU.Contains(search)));
            }

            return await query.CountAsync();
        }
    }
}