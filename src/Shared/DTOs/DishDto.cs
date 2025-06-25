// File: Shared/DTOs/DishDto.cs
namespace Shared.DTOs
{
    public class DishDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}