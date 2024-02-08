using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class ExceptionDAL : BaseDAL<ExceptionLog>, IExceptionDAL
    {
        private OfficeManagementTool_IS2023_team2Context _context;

        public ExceptionDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
            this._context = context;
        }

        public async Task<PagedList<ExceptionLogViewModel>> GetExceptionsByFilter(ExceptionFilterRequest searchRequest)
        {
            var query = table.GroupJoin(
                _context.Users,
                x => x.UserId,
                x => x.Id,
                (e, u) => new
                {
                    User = u,
                    ExceptionLog = e
                }
            ).SelectMany(o => o.User.DefaultIfEmpty(),(o, u) => new ExceptionLogViewModel
            {
                Id = o.ExceptionLog.Id,
                Message = o.ExceptionLog.Message,
                TimeStamp = o.ExceptionLog.TimeStamp,
                Exception = o.ExceptionLog.Exception,
                UserName = u != null ? u.FirstName + " " + u.LastName : "Anonymous"
            });

            if (!string.IsNullOrEmpty(searchRequest.SearchTerm))
            {
                searchRequest.SearchTerm = searchRequest.SearchTerm.Trim();

                query = query.Where(x => x.Message.ToLower().Contains(searchRequest.SearchTerm.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchRequest.SortField) && !string.IsNullOrEmpty(searchRequest.SortOrder))
            {
                Expression<Func<ExceptionLogViewModel, object>> orderFunction = searchRequest.SortField switch
                {
                    "message" => (x => x.Message),
                    "time" => (x => x.TimeStamp),
                    "user" => (x => x.UserName),
                    _ => (x => x.TimeStamp)
                };

                if (searchRequest.SortOrder == "asc")
                {
                    query = query.OrderBy(orderFunction).AsQueryable();
                }
                else
                {
                    query = query.OrderByDescending(orderFunction).AsQueryable();
                }
            }

            var length = await query.CountAsync();

            int pageIndex = searchRequest.PageIndex ?? 1;

            int pageSize = searchRequest.PageSize ?? 10;

            query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return new PagedList<ExceptionLogViewModel>(await query.ToListAsync(), length);
        }
    }
}