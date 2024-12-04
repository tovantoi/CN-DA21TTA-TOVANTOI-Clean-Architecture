using chuyennganh.Api.Endpoints;
using chuyennganh.Infrastructure.Extensions;
using chuyennganh.Application.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
// C?u hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});



// Add persistence services
builder.Services.AddInfractureServices(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add application services
builder.Services.AddApplicationServices();
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // S? d?ng trang l?i chi ti?t khi development
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error"); // X? lý l?i cho môi tr??ng production
    app.UseHsts(); // S? d?ng HSTS cho các k?t n?i b?o m?t
}

app.UseHttpsRedirection();

// S? d?ng các file t?nh t? wwwroot
app.UseStaticFiles(); // Ph?c v? file t?nh

// S? d?ng middleware CORS
app.UseCors("AllowAllOrigins");

app.UseRouting();

app.UseAuthorization();

// ??nh tuy?n các endpoint cho controllers
app.MapProductEndpoints();
app.MapCategoryEndpoints();
app.UseSession();
app.MapCustomerEndpoints();
app.MapOrderEndpoints();
app.MapControllers();
app.MapCouponEndpoints();
app.MapCustomerAddressEndpoints();

app.Run();
