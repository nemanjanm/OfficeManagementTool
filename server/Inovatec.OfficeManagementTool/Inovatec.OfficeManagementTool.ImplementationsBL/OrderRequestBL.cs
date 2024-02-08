using Inovatec.OfficeManagementTool.API.SignalR;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.AspNetCore.SignalR;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class OrderRequestBL : IOrderRequestBL
    {
        public IOrderRequestDAL _orderRequestDAL;
        public IOfficeDAL _officeDAL;
        public IItemDAL _itemDAL;
        public IUserDAL _userDAL;
        public IHubContext<OrdersHub> _hub;
        public OrderRequestBL(IOrderRequestDAL orderRequestDAL, IItemDAL itemDAL, IOfficeDAL officeDAL, IUserDAL userDAL, IHubContext<OrdersHub> hub) 
        {   
            _orderRequestDAL = orderRequestDAL;
            _officeDAL = officeDAL;
            _itemDAL = itemDAL;
            _userDAL = userDAL;
            _hub = hub;
        }

        public async Task<ActionResultResponse<string>> AddOrderRequest(OrderRequestRequest request)
        {
            
            if (! await _officeDAL.CheckIfExistsAsync(request.OfficeId))
            {
                return new ActionResultResponse<string>(null, false, "Office id wrong");
            }

            if (!await _itemDAL.CheckIfExistsAsync(request.ItemId))
            {
                return new ActionResultResponse<string>(null, false, "Item id wrong");
            }

            if (!await _userDAL.CheckIfExistsAsync(request.UserId))
            {
                return new ActionResultResponse<string>(null, false, "User id wrong");
            }


            OrderRequest orderRequest = new OrderRequest();
            orderRequest.UserId = request.UserId;
            orderRequest.OfficeId = request.OfficeId;
            orderRequest.Amount = request.Amount;
            orderRequest.ItemId = request.ItemId;
            orderRequest.InOrder = false;

            await _orderRequestDAL.Insert(orderRequest);
            await _orderRequestDAL.SaveChangesAsync();
            await _hub.Clients.Group("orders_" + request.OfficeId).SendAsync("NewOrder", request);
            return new ActionResultResponse<string>(null, true, "Succesfully added Order");
        }

        public async Task<ActionResultResponse<string>> DeleteOrderRequest(long id)
        {
            OrderRequest req = await _orderRequestDAL.GetById(id);
            if (req == null)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }
            await _orderRequestDAL.Delete(id);
            await _orderRequestDAL.SaveChangesAsync();
            await _hub.Clients.Group("orders_" + req.OfficeId).SendAsync("DeletedOrder", req);
            return new ActionResultResponse<string>(null, false, "Succesfully deleted Order");
        }

        public async Task<ActionResultResponse<string>> EditOrderRequest(OrderRequestRequest request)
        {
            OrderRequest orderRequest = null;
            if(request.Id != null)
            {
                orderRequest = (await _orderRequestDAL.GetAllByFilter(order => order.Id == request.Id && !order.IsDeleted && !order.InOrder)).First();
            }

            if (orderRequest == null)
            {
                orderRequest = (await _orderRequestDAL.GetAllByFilter(req => req.UserId == request.UserId && req.ItemId == request.ItemId && !req.IsDeleted && !req.InOrder)).First();
                orderRequest.Amount = request.Amount + orderRequest.Amount;
            }
            else
            {
                orderRequest.Amount = request.Amount;
            }

            await _orderRequestDAL.Update(orderRequest);
            await _orderRequestDAL.SaveChangesAsync();
            await _hub.Clients.Group("orders_" + request.OfficeId).SendAsync("NewOrder", request);
            return new ActionResultResponse<string>(null, true, "Succesfully edited Order");
        }

        public async Task<PagedList<OrderRequestViewModel>> GetAllOrderRequest(RequestOrderFilter orderRequest)
        {
            return await _orderRequestDAL.GetAllOrderRequests(orderRequest);
        }
    }
}