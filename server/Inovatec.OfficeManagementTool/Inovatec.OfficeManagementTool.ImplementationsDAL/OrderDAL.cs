using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class OrderDAL : BaseDAL<Order>, IOrderDAL
    {
        public OrderDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }

        public async Task<PagedList<OrderViewModel>> GetAllOrders(OrderFilterRequest editOrder)
        {
            var query = table.Where(x => !x.IsDeleted).Select(x => new OrderViewModel
            {
                Id = x.Id,
                OfficeId = x.OfficeId,
                DateCreated = x.DateCreated,
                State = x.State
            });

            if (editOrder.State > -1)
            {
                query = query.Where(x => x.State == editOrder.State);
            }

            int totalRecords = await query.CountAsync();

            if (editOrder.PageIndex == -1)
            {
                totalRecords = await query.CountAsync();
                return new PagedList<OrderViewModel>(await query.ToListAsync(), totalRecords);
            }

            int pageIndex = editOrder.PageIndex ?? 1;
            int pageSize = editOrder.PageSize ?? 10;

            return new PagedList<OrderViewModel>(await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync(), totalRecords);
        }
        public async Task<bool> CheckIfExistsAsync(long id)
        {
            return await table.AnyAsync(x => !x.IsDeleted && x.Id.Equals(id));
        }

        public async Task<long> CreateOrder(long officeId)
        {
            var output = new OutputParameter<int>();
            await _context.Procedures.CreateOrderAsync(officeId, output);
            long orderId = output.Value;
            return orderId;
        }
    }
}