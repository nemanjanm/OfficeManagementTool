using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels.Scheduler;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface ISchedulerBL
    {
        Task<ActionResultResponse<string>> ScheduleOrderNotification(SchedulerCreateRequest request);
        Task<ActionResultResponse<string>> TurnOffScheduledOrderNotification(SchedulerCreateRequest request);
        Task<ActionResultResponse<List<long>>> OfficesToSendOrderNotificationTo();
    }
}