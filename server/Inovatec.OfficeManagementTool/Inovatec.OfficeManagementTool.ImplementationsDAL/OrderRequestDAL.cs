using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class OrderRequestDAL : BaseDAL<OrderRequest>, IOrderRequestDAL
    {
        public OrderRequestDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<PagedList<OrderRequestViewModel>> GetAllOrderRequests(RequestOrderFilter filterRequest)
        {
            var query = table.Where(x => !x.IsDeleted && !x.InOrder).Select(x => new OrderRequestViewModel
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User.FirstName + " " + x.User.LastName,
                ItemId = x.ItemId,
                ItemName = x.Item.Name,
                OfficeId = x.OfficeId,
                OfficeName = x.Office.Name,
                Amount = x.Amount,
                InOrder = x.InOrder
            });

            if (filterRequest.ByUser != null && filterRequest.ByUser > -1)
            {
                query = query.Where(x => x.UserId == filterRequest.ByUser);
            }

            if (filterRequest.ByOffice != null && filterRequest.ByOffice > -1)
            {
                query = query.Where(x => x.OfficeId == filterRequest.ByOffice).GroupBy(x => x.ItemId).Select(y => new OrderRequestViewModel
                {
                    Id = y.Key,
                    Amount = y.Sum(x => x.Amount),
                    ItemId =y.FirstOrDefault().ItemId,
                    ItemName = y.FirstOrDefault().ItemName,
                    OfficeId = y.FirstOrDefault().OfficeId,
                    InOrder = y.FirstOrDefault().InOrder,
                    UserId = y.FirstOrDefault().UserId,
                });
            }

            if (!string.IsNullOrEmpty(filterRequest.SortField))
            {
                Expression<Func<OrderRequestViewModel, object>> orderFunction = filterRequest.SortField switch
                {
                    "item_name" => (x => x.ItemName),
                    "user_name" => (x => x.UserName),
                    "office_name" => (x => x.OfficeName),
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

            int totalRecords = await query.CountAsync();

            if (filterRequest.PageIndex == -1)
            {
                return new PagedList<OrderRequestViewModel>(await query.ToListAsync(), totalRecords);
            }

            int pageIndex = filterRequest.PageIndex ?? 1;
            int pageSize = filterRequest.PageSize ?? 10;

            return new PagedList<OrderRequestViewModel>(await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync(), totalRecords);
        }

        public async Task<List<OrderRequestViewModel>> GetSumOrderRequestsForOffice(long officeId)
        {
            var query = table.Where(x => !x.IsDeleted && x.OfficeId == officeId && !x.InOrder).Select(x => new OrderRequestViewModel
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User.FirstName + " " + x.User.LastName,
                ItemId = x.ItemId,
                ItemName = x.Item.Name,
                OfficeId = x.OfficeId,
                OfficeName = x.Office.Name,
                Amount = x.Amount,
                InOrder = x.InOrder
            });

            query = query.GroupBy(x => x.ItemId).Select(y => new OrderRequestViewModel
            {
                Id = y.Key,
                Amount = y.Sum(x => x.Amount),
                ItemId = y.FirstOrDefault().ItemId,
                ItemName = y.FirstOrDefault().ItemName,
                OfficeId = y.FirstOrDefault().OfficeId,
                InOrder = y.FirstOrDefault().InOrder,
                UserId = y.FirstOrDefault().UserId,
            });

            return await query.ToListAsync();
        }

        public async Task<bool> CheckIfOrderExists(long itemId, long userId)
        {
            return table.Where(order => order.UserId == userId && order.ItemId == itemId && !order.IsDeleted && !order.InOrder).Count() > 0;
        }
    }
}