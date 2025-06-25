// File: OrderService/Models/Order.cs
namespace OrderService.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty; // This will link to the user from IdentityService
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalPrice { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}