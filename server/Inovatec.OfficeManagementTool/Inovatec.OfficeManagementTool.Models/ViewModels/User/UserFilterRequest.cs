namespace Inovatec.OfficeManagementTool.Models.ViewModels.User
{
    public class UserFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? Search { get; set; } = string.Empty;
        public long? OfficeId { get; set; } = -1;
        public string? SortField { get; set;} = string.Empty;
        public long? SortOrder { get; set; } = 1;
    }
}