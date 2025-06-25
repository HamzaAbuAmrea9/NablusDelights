// File: ProductService/Program.cs
// PROVIDING FULL CODE FOR CLARITY

using System.Text; // <-- ADD THIS
using Microsoft.AspNetCore.Authentication.JwtBearer; // <-- ADD THIS
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; // <-- ADD THIS
using ProductService.Data;
using StackExchange.Redis;


var builder = WebApplication.CreateBuilder(args);

// 1. Configure DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Configure Redis Cache
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = ConfigurationOptions.Parse("localhost:6379", true);
    return ConnectionMultiplexer.Connect(configuration);
});

// --- START OF NEW CODE ---
// 3. Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
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
// --- END OF NEW CODE ---

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seeding logic...
using (var scope = app.Services.CreateScope())
{
    // ... your existing seeding logic for dishes ...
}

app.Run();