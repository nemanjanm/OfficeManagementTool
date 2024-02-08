namespace Inovatec.OfficeManagementTool.Models
{
    public class CategoryFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? CategoryName { get; set; } = string.Empty;
        public int? CategoryType { get; set; } = -1;
        public string? SortField { get; set;} = string.Empty;
        public int? SortOrder { get; set; } = 1;
    }
}