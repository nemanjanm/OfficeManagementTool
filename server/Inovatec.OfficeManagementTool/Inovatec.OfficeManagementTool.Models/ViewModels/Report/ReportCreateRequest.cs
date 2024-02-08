using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models.ViewModels.Report
{
    public class ReportCreateRequest
    {
        public long UserId { get; set; }
        public string Description { get; set; }
        public long OfficeId { get; set; }
        public int Category { get; set; }
        public long EquipmentId { get; set; }
    }
}
