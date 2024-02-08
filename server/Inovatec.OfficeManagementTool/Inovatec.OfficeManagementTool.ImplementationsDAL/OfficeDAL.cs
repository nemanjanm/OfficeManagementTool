using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class OfficeDAL : BaseDAL<Office>, IOfficeDAL
    { 
        public OfficeDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<bool> CheckIfExistsAsync(long id)
        {
            return await table.AnyAsync(x => !x.IsDeleted && x.Id.Equals(id));
        }

        public async Task<List<OfficeCreateRequest>> GetOffices()
        {
            var query = table.Where(x => !x.IsDeleted).Select(x => new OfficeCreateRequest
            {
                Id = x.Id,
                Name = x.Name,
                DateCreated = x.DateCreated
            });

            return await query.ToListAsync();
        }

        public async Task<List<OfficeCreateRequest>> GetOfficesByFilter(SearchRequest searchRequest)
        {
            var query = table.Where(x => !x.IsDeleted).Select(x => new OfficeCreateRequest
            {
                Id = x.Id,
                Name = x.Name,
                DateCreated = x.DateCreated
            });

            if (!string.IsNullOrEmpty(searchRequest.SearchTerm))
            {
                searchRequest.SearchTerm = searchRequest.SearchTerm.Trim();
                query = query.Where(x => x.Name.ToLower().Contains(searchRequest.SearchTerm.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchRequest.SortField) && !string.IsNullOrEmpty(searchRequest.SortOrder))
            {
                Expression<Func<OfficeCreateRequest, object>> orderFunction = searchRequest.SortField switch
                {
                    "name" => (x => x.Name),
                    "date" => (x => x.DateCreated),
                    _ => (x => x.DateCreated)
                };
                
                if(searchRequest.SortOrder == "asc")
                {
                    query = query.OrderBy(orderFunction).AsQueryable();
                }
                else
                {
                    query = query.OrderByDescending(orderFunction).AsQueryable();
                }
            }

            return await query.ToListAsync();
        }
    }
}
