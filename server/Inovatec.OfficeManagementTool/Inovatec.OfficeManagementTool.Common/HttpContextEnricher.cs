using Microsoft.AspNetCore.Http;
using Serilog.Core;
using Serilog.Events;
using System.Security.Claims;

namespace Inovatec.OfficeManagementTool.Common
{
    public class HttpContextEnricher : ILogEventEnricher
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextEnricher(): this(new HttpContextAccessor()) { }

        public HttpContextEnricher(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            string userId;

            if (httpContext != null) {
                userId = httpContext?.User?.FindFirstValue("Id");

                if (userId == "" || userId == null) {

                }
                else
                {
                    Console.WriteLine(userId);
                    logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("UserId", long.Parse(userId), true));
                }
            }
        }
    }
    public class HttpContextModel
    {
        public string Method { get; init; }
        public long User { get; init; }
    }
}