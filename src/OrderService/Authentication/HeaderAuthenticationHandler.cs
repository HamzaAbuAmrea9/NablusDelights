// File: OrderService/Authentication/HeaderAuthenticationHandler.cs
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace OrderService.Authentication
{
    public class HeaderAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public HeaderAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Check if the "uid" header exists.
            if (!Request.Headers.TryGetValue("uid", out var userIdValues))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var userId = userIdValues.FirstOrDefault();
            if (string.IsNullOrEmpty(userId))
            {
                return Task.FromResult(AuthenticateResult.Fail("User ID from header is missing."));
            }

            // Create the claims for the user.
            var claims = new[] { new Claim("uid", userId) };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}