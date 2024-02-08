using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models.ViewModels.Report
{
    public class ReportFilterRequest
    {
        public int First { get; set; }
        public int Rows { get; set; }
        public string? SortBy { get; set; }
        public int? Order { get; set; }
        public string? SearchDescription { get; set; }
        public string? SearchOffice { get; set; }
        public string? SearchUser { get; set; }
        public int? State { get; set; }
        public int? Category { get; set; }
        public int? UserId { get; set; }
    }
}
