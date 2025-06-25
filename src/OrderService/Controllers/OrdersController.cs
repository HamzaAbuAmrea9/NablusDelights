// File: OrderService/Controllers/OrdersController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.DTOs;
using OrderService.Models;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public OrdersController(OrderDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize] // <-- THIS IS THE KEY! Only logged-in users can access this.
        public async Task<IActionResult> CreateOrder(CreateOrderDto createOrderDto)
        {
            // Get the User ID from the token claims.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // In a real app, you would get dish details (name, price) by calling the ProductService.
            // For now, we'll just simulate it to keep this step focused.
            var newOrder = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                // We'll calculate the total price later
            };

            decimal totalPrice = 0;
            foreach (var itemDto in createOrderDto.OrderItems)
            {
                // SIMULATION: Assume price is 10 for any dish.
                var price = 10m;
                var orderItem = new OrderItem
                {
                    DishId = itemDto.DishId,
                    Quantity = itemDto.Quantity,
                    Price = price,
                    DishName = $"Dish-{itemDto.DishId}" // Simulated name
                };
                newOrder.OrderItems.Add(orderItem);
                totalPrice += orderItem.Quantity * orderItem.Price;
            }

            newOrder.TotalPrice = totalPrice;

            await _context.Orders.AddAsync(newOrder);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order created successfully!", OrderId = newOrder.Id });
        }
    }
}