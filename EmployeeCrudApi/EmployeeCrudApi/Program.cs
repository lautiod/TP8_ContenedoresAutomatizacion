using EmployeeCrudApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(o => o.AddPolicy("MyPolicy", policyBuilder =>
{
    // En producción y QA, deberías restringir los orígenes permitidos
    if (builder.Environment.IsDevelopment())
    {
        policyBuilder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    }
    else
    {
        // Obtener los orígenes permitidos desde la configuración
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
                             ?? new[] { "*" };
        
        Console.WriteLine($"🔍 CORS AllowedOrigins count: {allowedOrigins.Length}");
        foreach (var origin in allowedOrigins)
        {
            Console.WriteLine($"  - {origin}");
        }
        
        policyBuilder.WithOrigins(allowedOrigins)
                     .AllowAnyMethod()
                     .AllowAnyHeader()
                     .AllowCredentials()
                     .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight for 10 min
    }
}));

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
app.UseHttpsRedirection();
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
