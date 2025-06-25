// File: OrderService/Models/OrderItem.cs
namespace OrderService.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int DishId { get; set; } // The ID of the dish from ProductService
        public string DishName { get; set; } = string.Empty; // Store name for convenience
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int OrderId { get; set; } // Foreign key to the Order
        public Order? Order { get; set; }
    }
}