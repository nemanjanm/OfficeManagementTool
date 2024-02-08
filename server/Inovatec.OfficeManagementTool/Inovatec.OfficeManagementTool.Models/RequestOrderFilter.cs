using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.Models
{
    public class RequestOrderFilter
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public int? ByUser { get; set; } = -1;
        public int? ByOffice { get; set; } = -1;
        public string? SortField { get; set; } = string.Empty;
        public int? SortOrder { get; set; } = 1;
    }
}
