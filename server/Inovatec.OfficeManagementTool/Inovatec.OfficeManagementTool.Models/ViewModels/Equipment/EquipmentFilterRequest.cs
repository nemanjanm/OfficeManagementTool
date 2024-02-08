namespace Inovatec.OfficeManagementTool.Models.ViewModels.Equipment
{
    public class EquipmentFilterRequest
    {
        public int? PageIndex { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? Search { get; set; } = string.Empty;
        public long? UserId { get; set; } = 0;
        public string? SortField { get; set; } = string.Empty;
        public string? SortOrder { get; set; } = string.Empty;
        public bool? Assigned { get; set; }
    }
}