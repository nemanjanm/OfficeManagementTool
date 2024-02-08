using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models.ViewModels.Report
{
    public class ReportViewModel
    {
        public long Id { get; set; }
        public long OfficeId { get; set; }
        public long UserId { get; set; }
        public string Description { get; set; }
        public int State { get; set; }
        public long EquipmentId { get; set; }
        public int Category { get; set; }
        public DateTime DateCreated { get; set; }
        public string UserFullName { get; set; }
        public string CategoryName { get; set; }
        public string OfficeName { get; set; }
        public string StateName { get; set; }
    }
}
