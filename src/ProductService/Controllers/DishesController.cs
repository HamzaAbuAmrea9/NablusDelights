// File: ProductService/Controllers/DishesController.cs
// PROVIDING FULL CODE FOR CLARITY

using System.Text.Json;
using Microsoft.AspNetCore.Authorization; // <-- ADD THIS
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Models; // We need the internal Dish model for creating/updating
using Shared.DTOs;
using StackExchange.Redis;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DishesController : ControllerBase
    {
        private readonly ProductDbContext _context;
        private readonly IDatabase _redisDatabase;

        public DishesController(ProductDbContext context, IConnectionMultiplexer redis)
        {
            _context = context;
            _redisDatabase = redis.GetDatabase();
        }
        
        // This is a public endpoint, anyone can access it.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DishDto>>> GetDishes()
        {
            // Note: I'm filling out the .Select() to avoid a bug.
            var dishes = await _context.Dishes
                .Select(d => new DishDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    Price = d.Price
                })
                .ToListAsync();
            return Ok(dishes);
        }

        // This is also public.
        [HttpGet("{id}")]
        public async Task<ActionResult<DishDto>> GetDishById(int id)
        {
            var cachedDishJson = await _redisDatabase.StringGetAsync($"dish:{id}");
            if (!cachedDishJson.IsNullOrEmpty)
            {
                var cachedDish = JsonSerializer.Deserialize<DishDto>(cachedDishJson);
                Console.WriteLine($"--> Dish {id} served from CACHE.");
                return Ok(cachedDish);
            }

            var dishFromDb = await _context.Dishes.FindAsync(id);
            if (dishFromDb == null) return NotFound();
            
            Console.WriteLine($"--> Dish {id} served from DATABASE.");

            var dishDto = new DishDto
            {
                Id = dishFromDb.Id,
                Name = dishFromDb.Name,
                Description = dishFromDb.Description,
                Price = dishFromDb.Price
            };

            await _redisDatabase.StringSetAsync($"dish:{id}", JsonSerializer.Serialize(dishDto), TimeSpan.FromMinutes(5));
            return Ok(dishDto);
        }

        // --- START OF NEW ADMIN-ONLY ENDPOINTS ---

        [HttpPost]
        [Authorize(Roles = "Admin")] // Only users with the "Admin" role can access this.
        public async Task<ActionResult<DishDto>> CreateDish(CreateDishDto createDishDto)
        {
            var dish = new Dish
            {
                Name = createDishDto.Name,
                Description = createDishDto.Description,
                Price = createDishDto.Price,
                ImageUrl = createDishDto.ImageUrl
            };

            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();

            // Return the created dish as a DishDto
            var dishDto = new DishDto
            {
                Id = dish.Id,
                Name = dish.Name,
                Description = dish.Description,
                Price = dish.Price
            };

            return CreatedAtAction(nameof(GetDishById), new { id = dish.Id }, dishDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDish(int id, CreateDishDto updateDishDto)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
            {
                return NotFound();
            }

            dish.Name = updateDishDto.Name;
            dish.Description = updateDishDto.Description;
            dish.Price = updateDishDto.Price;
            dish.ImageUrl = updateDishDto.ImageUrl;

            await _context.SaveChangesAsync();
            
            // Invalidate the cache for this item
            await _redisDatabase.KeyDeleteAsync($"dish:{id}");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
            {
                return NotFound();
            }

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();

            // Invalidate the cache for this item
            await _redisDatabase.KeyDeleteAsync($"dish:{id}");

            return NoContent();
        }
        // --- END OF NEW ADMIN-ONLY ENDPOINTS ---
    }
}