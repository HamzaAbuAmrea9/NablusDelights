// File: ApiGateway/Program.cs
// PROVIDING FULL CODE FOR CLARITY

using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- START OF NEW CORS CONFIGURATION ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // Your Next.js app's URL
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
// --- END OF NEW CORS CONFIGURATION ---

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddOcelot();

var app = builder.Build();

app.MapGet("/", () => "API Gateway is running.");

// --- ADD THE CORS MIDDLEWARE HERE ---
// It's important to add it before the Ocelot middleware
app.UseCors(MyAllowSpecificOrigins);
// --- END OF ADDED MIDDLEWARE ---

await app.UseOcelot();

app.Run();