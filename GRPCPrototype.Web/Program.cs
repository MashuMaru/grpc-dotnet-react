var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddCors(options => options.AddPolicy(
    name: "AllowReactApp",
    configurePolicy: corsPolicyBuilder => corsPolicyBuilder
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// builder.Services.AddSingleton<IGreeterService, GreeterService>();

var app = builder.Build();

// Configure Swagger for gRPC API documentation (optional)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files and React frontend (SPA)
app.UseDefaultFiles();
app.UseStaticFiles();

// Fallback to index.html for SPA routing
app.MapFallbackToFile("index.html");
app.UseCors("AllowReactApp");

// Additional middleware
app.UseAuthorization();
app.MapControllers();

app.Run();