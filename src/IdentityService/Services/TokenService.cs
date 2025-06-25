// File: IdentityService/Services/TokenService.cs
// PROVIDING FULL CODE FOR CLARITY

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity; // <-- ADD THIS
using Microsoft.IdentityModel.Tokens;

namespace IdentityService.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager; // <-- ADD THIS

        // Inject UserManager
        public TokenService(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            _config = config;
            _userManager = userManager; // <-- ADD THIS
        }

        // Method is now async because getting roles is an async operation
        public async Task<string> GenerateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            // --- START OF NEW CODE ---
            // Add role claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            // --- END OF NEW CODE ---

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}