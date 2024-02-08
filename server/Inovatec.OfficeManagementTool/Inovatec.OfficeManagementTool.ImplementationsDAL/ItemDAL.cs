using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class ItemDAL : BaseDAL<Item>, IItemDAL
    {
        public ItemDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<PagedList<ItemViewModel>> GetAllItems(ItemFilterRequest filterRequest)
        {

            int totalRecords = 0;
            var query = table.Where(x => !x.IsDeleted).Select(x => new ItemViewModel
            {
                Id = x.Id,
                Name = x.Name,
                CategoryId = x.Category.Id,
                CategoryName = x.Category.Name,
                CategoryType = x.Category.CategoryType
            });

            if (filterRequest.Category != null)
            {
                query = query.Where(x=>x.CategoryId == filterRequest.Category);
                filterRequest.CategoryType = -1;
            }

            if (!string.IsNullOrEmpty(filterRequest.ItemName))
            {
                filterRequest.ItemName = filterRequest.ItemName.Trim();
                query = query.Where(x => x.Name.ToLower().Contains(filterRequest.ItemName.ToLower()));
            }

            if (filterRequest.CategoryType != null && filterRequest.CategoryType > -1)
            {
                query = query.Where(x => x.CategoryType == filterRequest.CategoryType);
            }

            if (!string.IsNullOrEmpty(filterRequest.ItemName))
            {
                filterRequest.ItemName = filterRequest.ItemName.Trim();
                query = query.Where(x => x.Name.ToLower().Contains(filterRequest.ItemName.ToLower()));
            }

            if (!string.IsNullOrEmpty(filterRequest.SortField))
            {
                Expression<Func<ItemViewModel, object>> orderFunction = filterRequest.SortField switch
                {
                    "name" => (x => x.Name),
                    "cetegory_type" => (x => x.CategoryType),
                    _ => (x => x.Id)
                };

                if (filterRequest.SortOrder == 1)
                {
                    query = query.OrderBy(orderFunction);
                }
                else if (filterRequest.SortOrder == -1)
                {
                    query = query.OrderByDescending(orderFunction);
                }
            }

            if (filterRequest.PageIndex == -1)
            {
                totalRecords = await query.CountAsync();
                return new PagedList<ItemViewModel>(await query.ToListAsync(), totalRecords);
            }

            totalRecords = await query.CountAsync();

            int pageIndex = filterRequest.PageIndex ?? 1;
            int pageSize = filterRequest.PageSize ?? 10;

            return new PagedList<ItemViewModel>(await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync(), totalRecords);
        }

        public async Task<bool> CheckIfExistsAsync(long id)
        {
            return await table.AnyAsync(x => !x.IsDeleted && x.Id.Equals(id));
        }
    }
}