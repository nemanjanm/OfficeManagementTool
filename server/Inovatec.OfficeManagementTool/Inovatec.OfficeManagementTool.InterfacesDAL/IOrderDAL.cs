using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IOrderDAL : IBaseDAL<Order>
    {
        public Task<PagedList<OrderViewModel>> GetAllOrders(OrderFilterRequest editOrder);
        public Task<bool> CheckIfExistsAsync(long id);
        Task<long> CreateOrder(long officeId);
    }
}