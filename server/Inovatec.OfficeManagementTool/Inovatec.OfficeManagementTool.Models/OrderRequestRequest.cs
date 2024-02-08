using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models
{
    public  class OrderRequestRequest
    {
        public long? Id { get; set; }
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public int OfficeId { get; set; }
        public int Amount { get; set; }
    }
}
