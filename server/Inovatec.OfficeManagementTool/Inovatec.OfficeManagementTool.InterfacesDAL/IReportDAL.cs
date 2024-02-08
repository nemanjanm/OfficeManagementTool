using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IReportDAL
    {
        Task InsertReport(ReportCreateRequest request);
        Task<PagedList<ReportViewModel>> GetAllReports(ReportFilterRequest filterRequest);
        Task UpdateState(Report report);
    }
}
