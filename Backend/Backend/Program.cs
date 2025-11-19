using EmployeeCrudApi.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine($"🔍 Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"🔍 IsDevelopment: {builder.Environment.IsDevelopment()}");

// Add services to the container.
builder.Services.AddCors(o => o.AddPolicy("MyPolicy", policyBuilder =>
{
    // Obtener los orígenes permitidos desde la configuración
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
    
    // Si no hay configuración de array, intentar obtener una variable de entorno simple
    if (allowedOrigins == null || allowedOrigins.Length == 0)
    {
        var singleOrigin = builder.Configuration["AllowedOrigins"];
        if (!string.IsNullOrEmpty(singleOrigin))
        {
            allowedOrigins = singleOrigin.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }
    }
    
    Console.WriteLine($"🔍 CORS AllowedOrigins: {(allowedOrigins != null ? string.Join(", ", allowedOrigins) : "NULL")}");
    
    if (allowedOrigins != null && allowedOrigins.Length > 0)
    {
        // Configuración específica con orígenes permitidos
        policyBuilder.WithOrigins(allowedOrigins)
                     .AllowAnyMethod()
                     .AllowAnyHeader()
                     .AllowCredentials()
                     .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    }
    else
    {
        // Fallback: permitir cualquier origen (solo para desarrollo)
        Console.WriteLine("⚠️ WARNING: Using AllowAnyOrigin");
        policyBuilder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    }
}));

// Registrar IMongoClient como singleton
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("MongoDB") 
                           ?? configuration.GetSection("MongoDB:ConnectionString").Value;
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton<IEmployeeService, EmployeeService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "QA")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Recommended order
// No usar UseHttpsRedirection cuando está detrás de un proxy como Render
// app.UseHttpsRedirection();
app.UseRouting();
// Ensure CORS runs between routing and endpoint execution
app.UseCors("MyPolicy");

app.UseAuthorization();

app.MapControllers();
// Simple health endpoint to verify the app is running
app.MapGet("/healthz", () => Results.Ok(new { status = "ok", env = app.Environment.EnvironmentName }))
    .WithName("Healthz");

Console.WriteLine($"✅ API started. Environment: {app.Environment.EnvironmentName}");

app.Run();
