using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class OrderItemDAL : BaseDAL<OrderItem>, IOrderItemDAL
    {
        public OrderItemDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }
    }
}