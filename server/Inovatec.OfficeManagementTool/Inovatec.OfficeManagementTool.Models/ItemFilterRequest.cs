namespace Inovatec.OfficeManagementTool.Models
{
    public class ItemFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? ItemName { get; set; } = string.Empty;
        public int? CategoryType { get; set; } = -1;
        public string? SortField { get; set; } = string.Empty;
        public int? SortOrder { get; set; } = 1;
        public long? Category { get; set; }
    }
}