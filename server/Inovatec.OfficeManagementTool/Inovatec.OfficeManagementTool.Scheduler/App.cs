using Inovatec.OfficeManagementTool.InterfacesBL;

namespace Inovatec.OfficeManagementTool.Scheduler
{
    internal class App : IApp
    {
        private readonly IOrderBL _orderBL;

        public App(IOrderBL orderBL) 
        {
            _orderBL = orderBL;
        }

        public async Task SendOutEmails()
        {
            await _orderBL.SendOrders();
        }
    }
}