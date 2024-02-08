using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels.Scheduler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = $"{Role.Hr}")]
    public class SchedulerController : Controller
    {
        private readonly ISchedulerBL _schedulerBL;

        public SchedulerController(ISchedulerBL schedulerBL)
        {
            _schedulerBL = schedulerBL;
        }

        [HttpPost]
        public async Task<IActionResult> ScheduleOrderNotification(SchedulerCreateRequest request)
        {
            return Ok(await _schedulerBL.ScheduleOrderNotification(request));
        }

        [HttpPost("TurnOffScheduledOrderNotification")]
        public async Task<IActionResult> ScheduleOrderTrunOffNotification(SchedulerCreateRequest request)
        {
            return Ok(await _schedulerBL.TurnOffScheduledOrderNotification(request));
        }
    }
}