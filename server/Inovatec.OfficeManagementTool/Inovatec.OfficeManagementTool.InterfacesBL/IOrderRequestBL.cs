using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IOrderRequestBL
    {
        public Task<ActionResultResponse<string>> AddOrderRequest(OrderRequestRequest orderRequest);
        public Task<ActionResultResponse<string>> DeleteOrderRequest(long id);
        public Task<ActionResultResponse<string>> EditOrderRequest(OrderRequestRequest orderRequest);
        public Task<PagedList<OrderRequestViewModel>> GetAllOrderRequest(RequestOrderFilter orderRequest);
    }
}