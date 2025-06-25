// File: IdentityService/Program.cs
// PROVIDING FULL CODE FOR CLARITY

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using IdentityService.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure the DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Configure ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IdentityService.Services.TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

// --- START OF NEW CODE ---
// Seed the database with roles and a default admin user
try
{
    using var scope = app.Services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    
    // Apply migrations
    dbContext.Database.Migrate();

    // Create roles if they don't exist
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
    if (!await roleManager.RoleExistsAsync("User"))
    {
        await roleManager.CreateAsync(new IdentityRole("User"));
    }

    // Create a default admin user if it doesn't exist
    if (await userManager.FindByNameAsync("admin") == null)
    {
        var adminUser = new ApplicationUser
        {
            UserName = "admin",
            Email = "admin@example.com"
        };
        var result = await userManager.CreateAsync(adminUser, "AdminPassword123!");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during database seeding.");
}
// --- END OF NEW CODE ---

app.Run();