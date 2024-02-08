using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class OrderAttachmentDAL : BaseDAL<OrderAttachment>, IOrderAttachmentDAL
    {
        public OrderAttachmentDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
        }
    }
}