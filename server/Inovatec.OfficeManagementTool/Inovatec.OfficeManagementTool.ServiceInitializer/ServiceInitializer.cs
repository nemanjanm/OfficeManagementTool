using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.Common.AutoMapper;
using Inovatec.OfficeManagementTool.Common.EmailService;
using Inovatec.OfficeManagementTool.ImplementationsBL;
using Inovatec.OfficeManagementTool.ImplementationsDAL;
using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using System.Text;

namespace Inovatec.OfficeManagementTool.ServiceInitializer
{
    public static class ServiceInitializer
    {

        private static IServiceCollection InitializeDAL(this IServiceCollection services)
        {
            services.AddDbContext<OfficeManagementTool_IS2023_team2Context>
            (
                options => options.UseSqlServer(ConfigProvider.ConnectionString)
            );

            services.AddScoped<IUserDAL, UserDAL>();
            services.AddScoped<IExceptionDAL, ExceptionDAL>();
            services.AddScoped<IOfficeDAL, OfficeDAL>();
            services.AddScoped<IEquipmentDAL, EquipmentDAL>();
            services.AddScoped<ICategoryDAL, CategoryDAL>();
            services.AddScoped<IItemDAL, ItemDAL>();
            services.AddScoped<IReportDAL, ReportDAL>();
            services.AddScoped<IOrderRequestDAL, OrderRequestDAL>();
            services.AddScoped<IOrderDAL, OrderDAL>();
            services.AddScoped<IOrderItemDAL, OrderItemDAL>();
            services.AddScoped<IOrderAttachmentDAL, OrderAttachmentDAL>();
            return services;
        }

        private static IServiceCollection InitializeBL(this IServiceCollection services)
        {
            services.AddScoped<IUserBL, UserBL>();
            services.AddScoped<ICategoryBL, CategoryBL>();
            services.AddScoped<IItemBL, ItemBL>();
            services.AddScoped<IExceptionBL, ExceptionBL>();
            services.AddScoped<IEquipmentBL, EquipmentBL>();
            services.AddScoped<IOfficeBL, OfficeBL>();
            services.AddScoped<IReportBL, ReportBL>();
            services.AddScoped<IOrderRequestBL, OrderRequestBL>();
            services.AddScoped<IOrderBL, OrderBL>();
            services.AddScoped<IOrderItemBL, OrderItemBL>();
            services.AddScoped<IOrderAttachmentBL, OrderAttachmentBL>();
            return services;
        }

        private static IServiceCollection InitializeCors(this IServiceCollection services)
        {
            services.AddCors(options => options.AddPolicy(name: "OfficeOrigins",
                policy =>
                    {
                        policy.WithOrigins(ConfigProvider.ClientUrl).AllowAnyMethod().AllowAnyHeader().AllowCredentials();
                    })
            );

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = ConfigProvider.Issuer,
                    ValidAudience = ConfigProvider.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigProvider.JwtKey)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            return services;
        }

        private static IServiceCollection InitializeMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile));
            return services;
        }

        private static void InitializeCommonServices(this IServiceCollection services)
        {
            services.AddScoped<IEmailService, EmailService>();
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.InitializeMapper();
            services.InitializeBL();
            services.InitializeDAL();
            services.InitializeCors();
            services.InitializeCommonServices();
            services.InitializeSerilog();
            return services;
        }

        public static void InitializeSerilog(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Error()
                .WriteTo.MSSqlServer(
                    connectionString: ConfigProvider.ConnectionString,
                    sinkOptions: new MSSqlServerSinkOptions { TableName = "ExceptionLogs", SchemaName = "dbo", AutoCreateSqlTable = true },
                    columnOptions: new ColumnOptions 
                    { 
                        AdditionalColumns = new List<SqlColumn>
                        { 
                            new SqlColumn 
                            { 
                                ColumnName = "UserId",
                                DataType = System.Data.SqlDbType.BigInt,
                                AllowNull = true,
                                PropertyName = "UserId",
                            } 
                        } 
                    }
                )
                .Enrich.With<HttpContextEnricher>()
                .CreateLogger();

            services.AddLogging(builder =>
            {
                builder.AddSerilog();
            });

            services.AddSingleton<HttpContextEnricher>();
        }

        public static void InitializeServicesForScheduler(this IServiceCollection services)
        {
            services.AddDbContext<OfficeManagementTool_IS2023_team2Context>
            (
                options => options.UseSqlServer(ConfigProvider.ConnectionString)
            );

            services.AddScoped<IUserDAL, UserDAL>();
            services.AddScoped<IOfficeDAL, OfficeDAL>();
            services.AddScoped<IItemDAL, ItemDAL>();
            services.AddScoped<IOrderDAL, OrderDAL>();
            services.AddScoped<IOrderRequestDAL, OrderRequestDAL>();

            services.AddScoped<IUserBL, UserBL>();
            services.AddScoped<IOfficeBL, OfficeBL>();
            services.AddScoped<IItemBL, ItemBL>();
            services.AddScoped<IOrderBL, OrderBL>();

            services.AddScoped<IEmailService, EmailService>();

            services.AddAutoMapper(typeof(MappingProfile));
        }
    }
}