// File: OrderService/DTOs/CreateOrderDto.cs
namespace OrderService.DTOs
{
    public class CreateOrderDto
    {
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int DishId { get; set; }
        public int Quantity { get; set; }
    }
}