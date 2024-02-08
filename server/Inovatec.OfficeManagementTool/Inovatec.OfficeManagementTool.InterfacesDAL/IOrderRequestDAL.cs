using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IOrderRequestDAL : IBaseDAL<OrderRequest>
    {
        public Task<PagedList<OrderRequestViewModel>> GetAllOrderRequests(RequestOrderFilter filterRequest);
        public Task<List<OrderRequestViewModel>> GetSumOrderRequestsForOffice(long officeId);
        public Task<bool> CheckIfOrderExists(long itemId, long userId);
    }
}