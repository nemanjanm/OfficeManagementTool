using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.Common.EmailService;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Order;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class OrderBL : IOrderBL
    {
        private readonly IOrderDAL _orderDAL;
        private readonly IUserDAL _userDAL;
        private readonly IOrderRequestDAL _orderRequestDAL;
        private readonly IOrderItemDAL _orderItemDAL;
        private readonly IOfficeDAL _officeDAL;
        public readonly IEmailService _emailService;

        public OrderBL(IOrderDAL orderDAL, IUserDAL userDAL, IOrderRequestDAL orderRequestDAL, IOrderItemDAL orderItemDAL, IOfficeDAL officeDAL, IEmailService emailService)
        {
            _orderDAL = orderDAL;
            _userDAL = userDAL;
            _orderRequestDAL = orderRequestDAL;
            _orderItemDAL = orderItemDAL;
            _officeDAL = officeDAL;
            _emailService = emailService;
        }
        public async Task<ActionResultResponse<string>> AddOrder(long officeId)
        {
            var office = await _officeDAL.GetById(officeId);
            
            if (office == null || office.IsDeleted) 
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            } 

            Order order = new Order();
            order.OfficeId = officeId;
            order.State = (long)States.PENDING;

            await _orderDAL.Insert(order);
            await _orderDAL.SaveChangesAsync();

            var orderRequests = await _orderRequestDAL.GetAllByFilter(x => !x.InOrder && !x.IsDeleted);

            var items = orderRequests.GroupBy(x => x.ItemId).Select(y => new OrderItem
            {
                ItemId = y.Key,
                Amount = y.Sum(x => x.Amount),
                OrderId = order.Id
            }).ToList();

            foreach (var orderRequest in orderRequests)
            {
                orderRequest.InOrder = true;
                await _orderRequestDAL.Update(orderRequest);

            }

            foreach (var i in items)
            {
                await _orderItemDAL.Insert(i);
            }

            await _orderRequestDAL.SaveChangesAsync();
            await _orderItemDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, false, "Successfully added ItemOrder");
        }

        public async Task<ActionResultResponse<string>> EditOrder(EditOrderRequest editOrder)
        {
            var order = await _orderDAL.GetById(editOrder.Id);

            if (order == null || order.IsDeleted)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            order.State = editOrder.State;

            await _orderDAL.Update(order);
            await _orderDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "Successfully updated order");
        }

        public async Task<ActionResultResponse<string>> DeleteOrder(long id)
        {

            await _orderDAL.Delete(id);
            await _orderDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, false, "Successfully deleted order");
        }

        public async Task<List<OrderViewModel>> GetOrder()
        {
            List<Order> orders = await _orderDAL.GetAllByFilter(x=>!x.IsDeleted);
            List<OrderViewModel> orderViewModels = new List<OrderViewModel>();

            foreach (var order in orders)
            {
                OrderViewModel orderViewModel = new OrderViewModel();
                orderViewModel.OfficeId = order.OfficeId;
                orderViewModel.State = order.State;
                orderViewModel.DateCreated = order.DateCreated;
                orderViewModel.Id = order.Id;

                orderViewModels.Add(orderViewModel);
            }

            return orderViewModels;

        }

        public async Task SendOrders()
        {
            var offices = (await _officeDAL.GetAll());

            foreach (var office in offices)
            {
                var hrs = await _userDAL.GetHRs(office.Id);

                foreach (var hr in hrs)
                {
                    await ComposeEmail(hr, await _orderRequestDAL.GetSumOrderRequestsForOffice(office.Id), office.Id);
                }
            }
        }

        public async Task ComposeEmail(string hrEmail, List<OrderRequestViewModel> items, long officeId)
        {
            string body = "" +
                "<h1 style=\"color: #333333;  margin-bottom: 20px;\">Create Order</h1>" +
                "<table style=\"border:1px solid black; width: 100%;\"><tr><th style=\"border:1px solid black; background-color:#4F7942; color: white;\">Requested Item</th>" +
                "<th style=\"border:1px solid black; background-color:#4F7942; color: white;\">Amount</th></tr>";

            foreach (OrderRequestViewModel item in items)
            {
                body += "<tr><td style=\"display:none;\">" + item.ItemId + "</td><td style=\"border:1px solid black\">" + item.ItemName + "</td><td style=\"border:1px solid black\">" + item.Amount + "</td></tr>";
            }

            body += "</table><br>";
            body += " <p style=\"color: #333333;  line-height: 1.5; margin-bottom: 2px;\">Click the button below to take action:</p> " +
                "<a href=\"" + ConfigProvider.ClientUrl + "/accept-order" + "?email=" + hrEmail + "&officeId=" + officeId +
                "\" style=\"background-color: #4CAF50; display: inline-block; color: #ffffff; padding: 10px 20px;text-decoration: none;border-radius: 5px;\">Accept</a>";

            await _emailService.SendEmail(hrEmail, "Office Order", body, "Create Order");
        }

        public async Task<ActionResultResponse<long>> CreateOrder(CreateOrderRequest request)
        {
            var hr = await _userDAL.GetUserByEmail(request.Email);

            if (hr != null && hr!.Role == int.Parse(Role.Hr))
            {
                return new ActionResultResponse<long>(await _orderDAL.CreateOrder(request.OfficeId), true, "");
            }

            return new ActionResultResponse<long>(0, true, "");
        }
    }
}