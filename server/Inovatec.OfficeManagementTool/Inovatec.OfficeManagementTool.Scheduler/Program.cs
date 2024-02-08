using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.Scheduler;
using Inovatec.OfficeManagementTool.ServiceInitializer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;

IHost host = Host.CreateDefaultBuilder(args)
.ConfigureAppConfiguration(configuration =>
{
    var configRoot = configuration
        .SetBasePath(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? "")
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .Build();

    configRoot.Setup();
})
.ConfigureServices(services =>
{
    services.InitializeServicesForScheduler();
    services.AddSingleton<IApp,App>();
}).Build();

var app = host.Services.GetRequiredService<IApp>();

await app.SendOutEmails();