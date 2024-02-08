using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Order;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IOrderBL
    {
        public Task<ActionResultResponse<string>> AddOrder(long userId);
        public Task<ActionResultResponse<string>> DeleteOrder(long id);
        public Task<ActionResultResponse<string>> EditOrder(EditOrderRequest editOrder);
        public Task<List<OrderViewModel>> GetOrder();
        public Task SendOrders();
        public Task ComposeEmail(string hrEmail, List<OrderRequestViewModel> items, long officeId);
        public Task<ActionResultResponse<long>> CreateOrder(CreateOrderRequest request);
    }
}