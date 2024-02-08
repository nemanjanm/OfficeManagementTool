using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IReportBL
    {
        Task<ActionResultResponse<string>> InsertReport(ReportCreateRequest request);
        Task<ActionResultResponse<PagedList<ReportViewModel>>> GetAllReports(ReportFilterRequest filterRequest);
        Task<ActionResultResponse<string>> UpdateState(Report report);
    }
}
