// File: ProductService/Data/ProductDbContext.cs

using Microsoft.EntityFrameworkCore;
using ProductService.Models; // We need to use our Dish model

namespace ProductService.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
        {
        }

        // This DbSet represents the "Dishes" table in our database.
        public DbSet<Dish> Dishes { get; set; }
    }
}