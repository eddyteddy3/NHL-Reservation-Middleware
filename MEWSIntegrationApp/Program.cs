using MEWSIntegrationApp.Services;

var builder = WebApplication.CreateBuilder(args);

var confirguration = builder.Configuration;

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5000); // HTTP
    options.ListenLocalhost(5001, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// Register the HttpClient and Mews API Service
builder.Services.AddHttpClient<MewsApiService>();
builder.Services.AddTransient<MewsApiService>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>();
    var isProduction = builder.Environment.IsProduction();
    return new MewsApiService(httpClient, confirguration, isProduction: false);
});

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();

// Explicitly map controllers before UseSpa
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseHttpsRedirection();

// Serve Next.js frontend
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    }
});

app.Run();