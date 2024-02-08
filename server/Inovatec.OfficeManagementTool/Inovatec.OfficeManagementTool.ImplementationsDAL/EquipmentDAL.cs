using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Equipment;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class EquipmentDAL : BaseDAL<Equipment>, IEquipmentDAL
    {
        public EquipmentDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<bool> CheckIfExistsAsync(long id)
        {
            return await table.AnyAsync(x => !x.IsDeleted && x.Id.Equals(id));
        }

        public async Task<List<EquipmentViewModel>> GetEquipment()
        {
            var query = table.Where(x => !x.IsDeleted).Select(x => new EquipmentViewModel
            {
                Id = x.Id,
                ItemId = x.ItemId,
                UserId = x.UserId
            });

            return await query.ToListAsync();
        }
        public async Task<PagedList<EquipmentViewModel>> GetEquipmentByFilter(EquipmentFilterRequest searchRequest)
        {
            var query = table
                .Include(x => x.Item)
                .ThenInclude(x => x.Category)
                .Include(x => x.User)
                .Where(x => !x.IsDeleted)
                .Select(x => new EquipmentViewModel
            {
                Id = x.Id,
                ItemCode = x.ItemCode,
                ItemId = x.ItemId,
                ItemName = x.Item.Name,
                CategoryId = x.Item.CategoryId,
                CategoryName = x.Item.Category.Name,
                DateCreated = x.DateCreated,
                UserId = x.UserId,
                UserName = x.User == null? null: x.User.FirstName + " " + x.User.LastName
            }).AsQueryable();

            query = query.Where(x => x.UserId.Equals(null));

            if (!string.IsNullOrEmpty(searchRequest.Search))
            {
                searchRequest.Search = searchRequest.Search.Trim().ToLower();
                query = query.Where(x => 
                x.ItemName.ToLower().Contains(searchRequest.Search) ||
                x.CategoryName.ToLower().Contains(searchRequest.Search) ||
                x.ItemCode.ToLower().Contains(searchRequest.Search));
            }

            if (!string.IsNullOrEmpty(searchRequest.SortField) && !string.IsNullOrEmpty(searchRequest.SortOrder))
            {
                Expression<Func<EquipmentViewModel, object>> orderFunction = searchRequest.SortField switch
                {
                    "item" => (x => x.ItemName),
                    "category" => (x => x.CategoryName),
                    "code" => (x => x.ItemCode),
                    _ => (x => x.ItemName)
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

            return new PagedList<EquipmentViewModel>(await query.ToListAsync(), length);
        }

        public async Task<PagedList<EquipmentViewModel>> GetAssignedEquipmentByFilter(EquipmentFilterRequest searchRequest)
        {
            var query = table
                .Include(x => x.Item)
                .ThenInclude(x => x.Category)
                .Include(x => x.User)
                .Where(x => !x.IsDeleted)
                .Select(x => new EquipmentViewModel
                {
                    Id = x.Id,
                    ItemCode = x.ItemCode,
                    ItemId = x.ItemId,
                    ItemName = x.Item.Name,
                    CategoryId = x.Item.CategoryId,
                    CategoryName = x.Item.Category.Name,
                    DateCreated = x.DateCreated,
                    UserId = x.UserId,
                    UserName = x.User == null ? null : x.User.FirstName + " " + x.User.LastName
                }).AsQueryable();

            if (searchRequest.UserId > 0)
            {
                query = query.Where(x => x.UserId.Equals(searchRequest.UserId));
            }
            else
            {
                query = query.Where(x => !x.UserId.Equals(null));
            }

            if (!string.IsNullOrEmpty(searchRequest.Search))
            {
                searchRequest.Search = searchRequest.Search.Trim().ToLower();
                query = query.Where(x =>
                x.ItemName.ToLower().Contains(searchRequest.Search) ||
                x.CategoryName.ToLower().Contains(searchRequest.Search) ||
                x.ItemCode.ToLower().Contains(searchRequest.Search));
            }

            if (!string.IsNullOrEmpty(searchRequest.SortField) && !string.IsNullOrEmpty(searchRequest.SortOrder))
            {
                Expression<Func<EquipmentViewModel, object>> orderFunction = searchRequest.SortField switch
                {
                    "item" => (x => x.ItemName),
                    "category" => (x => x.CategoryName),
                    "code" => (x => x.ItemCode),
                    _ => (x => x.ItemName)
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

            return new PagedList<EquipmentViewModel>(await query.ToListAsync(), length);
        }

        Task<PagedList<EquipmentViewModel>> IEquipmentDAL.GetEquipment()
        {
            throw new NotImplementedException();
        }
    }
}