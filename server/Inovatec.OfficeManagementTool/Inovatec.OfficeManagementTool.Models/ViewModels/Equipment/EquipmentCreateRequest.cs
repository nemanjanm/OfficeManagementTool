namespace Inovatec.OfficeManagementTool.Models.ViewModels.Equipment
{
    public class EquipmentCreateRequest
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public string? ItemCode { get; set; }
        public long UserId { get; set; }
    }
}