namespace Inovatec.OfficeManagementTool.Models
{
    public class ExceptionFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; } = string.Empty;
        public string? SortField { get; set; } = string.Empty;
        public string? SortOrder { get; set; } = string.Empty;
    }
}