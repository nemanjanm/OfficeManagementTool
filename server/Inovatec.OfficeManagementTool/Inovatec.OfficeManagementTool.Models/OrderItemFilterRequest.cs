namespace Inovatec.OfficeManagementTool.Models
{
    public class OrderItemFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public long State { get; set; } = -1;
        public string OfficeName { get; set; } = string.Empty;
        public string? SortField { get; set; } = string.Empty;
        public int? SortOrder { get; set; } = 1;
    }
}