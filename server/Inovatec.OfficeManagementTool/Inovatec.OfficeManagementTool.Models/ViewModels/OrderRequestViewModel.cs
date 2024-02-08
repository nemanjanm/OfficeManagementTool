using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class OrderRequestViewModel
    {
        public long Id { get; set;}
        public long UserId { get; set;}
        public string UserName { get; set;} = string.Empty;
        public long ItemId { get; set;}
        public string ItemName { get; set;} = string.Empty;
        public int Amount { get; set;}
        public long OfficeId { get; set;}
        public string OfficeName { get; set;} = string.Empty;
        public bool InOrder { get; set;}
    }
}
