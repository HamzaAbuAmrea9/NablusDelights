// File: IdentityService/DTOs/LoginDto.cs
using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}