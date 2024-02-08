using Inovatec.OfficeManagementTool.API.Middlewares;
using Inovatec.OfficeManagementTool.API.SignalR;
using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.ServiceInitializer;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.Setup();
builder.Services.AddServices();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddSignalR();

builder.Host.UseSerilog();

AppDomain.CurrentDomain.ProcessExit += (s, e) => Log.CloseAndFlush();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("OfficeOrigins");

app.UseAuthentication(); 

app.UseAuthorization();


app.MapControllers();
app.MapHub<OrdersHub>("/hub/orders");

app.Run();