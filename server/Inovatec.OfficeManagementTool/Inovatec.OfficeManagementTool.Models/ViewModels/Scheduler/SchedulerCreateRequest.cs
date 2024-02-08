namespace Inovatec.OfficeManagementTool.Models.ViewModels.Scheduler
{
    public class SchedulerCreateRequest
    {
        public long OfficeId { get; set; }
        public DateTime ScheduledFor { get; set; }
        public bool Repeatable { get; set; }
    }
}