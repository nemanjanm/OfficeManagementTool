using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models.ViewModels.Order
{
    public class CreateOrderRequest
    {
        public long OfficeId { get; set; }
        public string Email { get; set; }
    }
}
