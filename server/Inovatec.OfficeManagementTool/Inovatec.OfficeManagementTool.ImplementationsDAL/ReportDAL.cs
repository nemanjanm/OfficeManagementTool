using AutoMapper;
using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class ReportDAL :BaseDAL<Report>, IReportDAL
    {
        private readonly IMapper _mapper;

        public ReportDAL(OfficeManagementTool_IS2023_team2Context context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<PagedList<ReportViewModel>> GetAllReports(ReportFilterRequest filterRequest)
        {
            Type typeC = typeof(Categories);
            Type typeS = typeof(States);
            var initQuery = table.Where(report => report.IsDeleted == false);

            if(filterRequest.UserId != null)
            {
                initQuery = initQuery.Where(report => report.UserId == filterRequest.UserId);
            }

            int length = initQuery.Count();

            var query = initQuery.Include(report => report.User).Include(report => report.Office).Select(report => new ReportViewModel {
                Id = report.Id,
                Description = report.Description,
                DateCreated = report.DateCreated,
                OfficeId = report.OfficeId,
                OfficeName = report.Office.Name,
                UserId = report.UserId,
                State = report.State,
                EquipmentId = report.EquipmentId,
                Category = report.Category,
                UserFullName = report.User.FirstName + " " + report.User.LastName,
                CategoryName = Enum.GetName(typeC, report.Category)!,
                StateName = Enum.GetName(typeS, report.State)!
            });

            if (filterRequest.State != null && filterRequest.State != -1)
            {
                query = query.Where(report => report.State == filterRequest.State);
            }

            if (filterRequest.State != null && filterRequest.Category != -1)
            {
                query = query.Where(report => report.Category == filterRequest.Category);
            }

            if (!string.IsNullOrEmpty(filterRequest.SearchUser))
            {
                query = query.Where(report => report.UserFullName.Contains(filterRequest.SearchUser.Trim()));
            }

            if(!string.IsNullOrEmpty(filterRequest.SearchOffice))
            {
                query = query.Where(report => report.OfficeName.Contains(filterRequest.SearchOffice.Trim()));
            }

            if(!string.IsNullOrEmpty(filterRequest.SearchDescription))
            {
                query = query.Where(report => report.Description.Contains(filterRequest.SearchDescription));
            }

            if(filterRequest.Order != null && filterRequest.Order != 0)
            {
                Expression<Func<ReportViewModel, object>> orderFunction = filterRequest.SortBy switch
                {
                    "description" => (x => x.Description),
                    "categoryName" => (x => x.Category),
                    "state" => (x => x.State),
                    "officeName" => (x => x.OfficeName),
                    "user" => (x => x.UserFullName),
                    "equipmentId" => (x => x.EquipmentId),
                    _ => (x => x.Id)
                };

                IQueryable<ReportViewModel> list;

                if (filterRequest.Order == 1)
                {
                    list = query.OrderBy(orderFunction);
                    
                }
                else
                {
                    list = query.OrderByDescending(orderFunction);
                }

                return new PagedList<ReportViewModel>(await list.Skip(filterRequest.First).Take(filterRequest.Rows).ToListAsync(), length);
            }

            return new PagedList<ReportViewModel>(await query.Skip(filterRequest.First).Take(filterRequest.Rows).ToListAsync(), length);
        }

        public async Task InsertReport(ReportCreateRequest request)
        {
            Report report = _mapper.Map<Report>(request);
            report.State = (int)States.PENDING;
            await Insert(report);
            await SaveChangesAsync();
        }
        public async Task UpdateState(Report report)
        {
            Report reportReal = await GetById(report.Id);
            reportReal.State = report.State;
            await Update(reportReal);
            await SaveChangesAsync();
        }
    }
}
