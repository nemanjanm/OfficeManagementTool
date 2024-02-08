using Inovatec.OfficeManagementTool.API.SignalR;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using Microsoft.AspNetCore.SignalR;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class ReportBL: IReportBL
    {
        private readonly IReportDAL _reportDAL;
        private readonly IHubContext<OrdersHub> _hub;

        public ReportBL(IReportDAL reportDAL, IHubContext<OrdersHub> hub)
        {
            _reportDAL = reportDAL;
            _hub = hub;
        }

        public async Task<ActionResultResponse<PagedList<ReportViewModel>>> GetAllReports(ReportFilterRequest filterRequest)
        {
            ActionResultResponse<PagedList<ReportViewModel>> resultResponse = new ActionResultResponse<PagedList<ReportViewModel>>();
            resultResponse.Data = await _reportDAL.GetAllReports(filterRequest);
            resultResponse.Status = true;
            return resultResponse;
        }

        public async Task<ActionResultResponse<string>> InsertReport(ReportCreateRequest request)
        {
            ActionResultResponse<string> result = new ActionResultResponse<string>();
            await _reportDAL.InsertReport(request);
            result.Status = true;
            result.Data = "ok";
            return result;
        }

        public async Task<ActionResultResponse<string>> UpdateState(Report report)
        {
            await _reportDAL.UpdateState(report);
            var res = new ActionResultResponse<string>();
            res.Status = true;
            res.Data = "OK";
            await _hub.Clients.Group("reports").SendAsync("StateChange", report);
            return res;
        }
    }
}
