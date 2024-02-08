using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IOrderItemBL
    {
        public Task<ActionResultResponse<string>> AddOrderItem(OrderitemRequest orderRequest);
        public Task<ActionResultResponse<string>> EditOrder(OrderitemRequest orderRequest);
        public Task<ActionResultResponse<string>> DeleteItemOrder(long id);
        public Task<List<OrderItemViewModel>> GetAllOrderItem(long id);
    }
}