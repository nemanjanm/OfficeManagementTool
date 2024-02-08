using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportBL _reportBL;
        private readonly IHttpContextAccessor _contextAccessor;

        public ReportController(IReportBL reportBL, IHttpContextAccessor httpContextAccessor)
        {
            _reportBL = reportBL;
            _contextAccessor = httpContextAccessor;
        }

        [HttpPut("create")]
        public async Task<IActionResult> CreateReport(ReportCreateRequest request)
        {
            ActionResultResponse<string> result = await _reportBL.InsertReport(request);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] ReportFilterRequest filterRequest)
        {
            ActionResultResponse<PagedList<ReportViewModel>> result = await _reportBL.GetAllReports(filterRequest);
            return Ok(result);
        }

        [HttpPut("updateState")]
        public async Task<IActionResult> UpdateState([FromBody] Report report)
        {
            var context = _contextAccessor.HttpContext;
            if(long.Parse(context?.User?.FindFirstValue("Id")) == report.UserId || context.User?.FindFirstValue(ClaimTypes.Role) == Role.Hr)
            {
                ActionResultResponse<string> result = await _reportBL.UpdateState(report);
                return Ok(result);
            }
            else
            {
                ActionResultResponse<string> result = new ActionResultResponse<string>();
                result.Status = false;
                result.Errors.Add("Unauthorized");
                return Ok(result);
            }
            
        }
    }
}
