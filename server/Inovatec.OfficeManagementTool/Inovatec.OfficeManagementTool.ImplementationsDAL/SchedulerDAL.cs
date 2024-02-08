using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class SchedulerDAL : BaseDAL<Scheduler>, ISchedulerDAL
    {
        public SchedulerDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<bool> CheckOffice(long id)
        {
            return await table.AnyAsync(x => x.OfficeId == id && !x.IsDeleted);
        }

        public async Task<List<long>> OfficesToSendNotification()
        {
            List<long> ids = await table.Where(x => x.Active && x.ScheduledFor.DayOfWeek == DateTime.Now.DayOfWeek && x.ScheduledFor.Date == DateTime.Now.Date)
                .Select(x => x.OfficeId)
                .ToListAsync();

            return ids;
        }

        public async Task UpdateRepeatableNotif(long officeId)
        {
            var scheduled = await table.FirstOrDefaultAsync(x => x.OfficeId == officeId);

            if (scheduled != null && scheduled.Repetable) 
            {
                scheduled.ScheduledFor = scheduled.ScheduledFor.AddDays(7);

                table.Update(scheduled);
            }
        }
    }
}