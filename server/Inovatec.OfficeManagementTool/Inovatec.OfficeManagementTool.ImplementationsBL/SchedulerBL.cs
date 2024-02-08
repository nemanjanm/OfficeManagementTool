using AutoMapper;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels.Scheduler;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class SchedulerBL : ISchedulerBL
    {
        private readonly ISchedulerDAL _schedulerDAL;
        private readonly IMapper _mapper;

        public SchedulerBL(ISchedulerDAL schedulerDAL, IMapper mapper)
        {
            _schedulerDAL = schedulerDAL;
            _mapper = mapper;
        }

        public async Task<ActionResultResponse<List<long>>> OfficesToSendOrderNotificationTo()
        {
            List<long> offices = await _schedulerDAL.OfficesToSendNotification();

            foreach (var office in offices) 
            {
                await _schedulerDAL.UpdateRepeatableNotif(office);
            }

            await _schedulerDAL.SaveChangesAsync();

            return new ActionResultResponse<List<long>>(offices, true, "");
        }

        public async Task<ActionResultResponse<string>> ScheduleOrderNotification(SchedulerCreateRequest request)
        {
            Scheduler scheduler = _mapper.Map<Scheduler>(request);
            scheduler.Active = true;

            if(await _schedulerDAL.CheckOffice(scheduler.OfficeId))
            {
                await _schedulerDAL.Update(scheduler);
                return new ActionResultResponse<string>("Scheduler.OrderScheduleUpdated", true, "");
            }

            await _schedulerDAL.Insert(scheduler);
            return new ActionResultResponse<string>("Scheduler.OrderScheduleAdded", true, "");
        }

        public async Task<ActionResultResponse<string>> TurnOffScheduledOrderNotification(SchedulerCreateRequest request)
        {
            Scheduler scheduler = _mapper.Map<Scheduler>(request);
            scheduler.Active = false;

            if (await _schedulerDAL.CheckOffice(scheduler.OfficeId))
            {
                await _schedulerDAL.Update(scheduler);
                return new ActionResultResponse<string>("Scheduler.OrderSchedulerTurnedOff", true, "");
            }

            return new ActionResultResponse<string>("Scheduler.NoOrder", true, "");
        }
    }
}