using Inovatec.OfficeManagementTool.Models.Entity;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface ISchedulerDAL : IBaseDAL<Scheduler>
    {
        public Task<bool> CheckOffice(long id);
        public Task<List<long>> OfficesToSendNotification();
        public Task UpdateRepeatableNotif(long officeId);
    }
}