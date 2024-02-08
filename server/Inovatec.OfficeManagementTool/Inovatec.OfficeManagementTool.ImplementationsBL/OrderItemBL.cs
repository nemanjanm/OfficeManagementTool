using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class OrderItemBL : IOrderItemBL
    {
        private readonly IOrderItemDAL _orderItemDAL;
        private readonly IUserDAL _userDAL;
        private readonly IOrderDAL _orderDAL;
        private readonly IItemDAL _itemDAL;
        public OrderItemBL(IOrderItemDAL orderItemDAL, IUserDAL userDAL, IOrderDAL orderDAL, IItemDAL itemDAL)
        {
            _orderItemDAL = orderItemDAL;
            _userDAL = userDAL;
            _orderDAL = orderDAL;
            _itemDAL = itemDAL;
        }

        public async Task<ActionResultResponse<string>> AddOrderItem(OrderitemRequest orderRequest)
        {
            var item = await _itemDAL.GetById(orderRequest.ItemId);
            var order = await _orderDAL.GetById(orderRequest.OrderId);

            if (item == null || item.IsDeleted) 
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            if (order == null || order.IsDeleted)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.ItemId = orderRequest.ItemId;
            orderItem.OrderId = orderRequest.OrderId;
            orderItem.Amount = orderRequest.Amount;

            await _orderItemDAL.Insert(orderItem);
            await _orderItemDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "Successfully added Order Item");
        }

        public async Task<ActionResultResponse<string>> EditOrder(OrderitemRequest orderRequest)
        {
            var orderItem = await _orderItemDAL.GetById(orderRequest.Id);

            if (orderItem == null || orderItem.IsDeleted)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            orderItem.Amount = orderRequest.Amount;
            await _orderItemDAL.Update(orderItem);
            await _orderItemDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "Successfully updated Order Item");
        }
        public async Task<ActionResultResponse<string>> DeleteItemOrder(long id)
        {
            var orderItem = await _orderItemDAL.GetById(id);

            if (orderItem == null || orderItem.IsDeleted)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            await _orderItemDAL.Delete(id);
            await _orderItemDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "Successfully deleted Order Item");
        }

        public async Task<List<OrderItemViewModel>> GetAllOrderItem(long id)
        {
            List<OrderItemViewModel> orderItemViewModels = new List<OrderItemViewModel>();
            List<OrderItem> list = await _orderItemDAL.GetAll();

            foreach (var item in list)
            {
                if (item.IsDeleted || item.OrderId != id) 
                { 
                    continue; 
                }

                OrderItemViewModel orderItemViewModel = new OrderItemViewModel();

                var itemName = await _itemDAL.GetById(item.ItemId);

                orderItemViewModel.OrderId = item.OrderId;
                orderItemViewModel.ItemId = item.ItemId;
                orderItemViewModel.ItemName = itemName.Name;
                orderItemViewModel.Amount = item.Amount;
                orderItemViewModel.Id = item.Id;
                orderItemViewModels.Add(orderItemViewModel);
            }

            return orderItemViewModels;
        }
    }
}