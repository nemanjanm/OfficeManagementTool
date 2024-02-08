using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public  class CategoryDAL : BaseDAL<Category>, ICategoryDAL
    {
        public CategoryDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
            
        }

        public async Task<PagedList<CategoryViewModel>> GetAllCategories(CategoryFilterRequest filterRequest)
        {
            var query = table.Where(x => !x.IsDeleted).Select(x => new CategoryViewModel
            {
                 Id = x.Id,
                 Name = x.Name, 
                 CategoryType = x.CategoryType
            });
            
            if (filterRequest.CategoryType != null && filterRequest.CategoryType > -1) 
            {
                query = query.Where(x => x.CategoryType == filterRequest.CategoryType);
            }

            if (!string.IsNullOrEmpty(filterRequest.CategoryName))
            {
                filterRequest.CategoryName = filterRequest.CategoryName.Trim();
                query = query.Where(x => x.Name.ToLower().Contains(filterRequest.CategoryName.ToLower()));
            }

            if (!string.IsNullOrEmpty(filterRequest.SortField))
            {
                Expression<Func<CategoryViewModel, object>> orderFunction = filterRequest.SortField switch
                {
                    "name" => (x => x.Name),
                    "category_type" => (x => x.CategoryType),
                    _ => (x => x.Id)
                };

                if (filterRequest.SortOrder == 1)
                {
                    query = query.OrderBy(orderFunction);
                }
                else if(filterRequest.SortOrder == -1)
                {
                    query = query.OrderByDescending(orderFunction);
                }
            }
            
            int totalRecords = await query.CountAsync();

            if (filterRequest.PageIndex == -1)
            {
                totalRecords = await query.CountAsync();
                return new PagedList<CategoryViewModel>(await query.ToListAsync(), totalRecords);
            }

            int pageIndex = filterRequest.PageIndex ?? 1;
            int pageSize = filterRequest.PageSize ?? 10;

            return new PagedList<CategoryViewModel>(await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync(), totalRecords);
        }

        public Task<CategoryViewModel> GetCategoryById(long id)
        {
            var query = table.Where(x => !x.IsDeleted && x.Id == id).Select(x => new CategoryViewModel
            {
                Id = x.Id,
                Name = x.Name,
                CategoryType = x.CategoryType
            });

            return query.FirstAsync();
        }

        public async Task<Category> GetByName(string name)
        {
            return await table.FirstOrDefaultAsync(x=> x.Name.Equals(name));
        }
    }
}