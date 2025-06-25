// File: IdentityService/Controllers/AuthController.cs
// PROVIDING FULL CODE FOR CLARITY

using IdentityService.DTOs;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using IdentityService.Services;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByNameAsync(registerDto.Username);
            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            var newUser = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (result.Succeeded)
            {
                // --- START OF NEW CODE ---
                // Assign the default "User" role to new registrations
                await _userManager.AddToRoleAsync(newUser, "User");
                // --- END OF NEW CODE ---
                return Ok(new { Message = "User registered successfully!" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        // Method is now async
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized("Invalid username or password.");
            }

            // GenerateToken is now async, so we must await it
            var token = await _tokenService.GenerateToken(user);

            return Ok(new { Token = token });
        }
    }
}