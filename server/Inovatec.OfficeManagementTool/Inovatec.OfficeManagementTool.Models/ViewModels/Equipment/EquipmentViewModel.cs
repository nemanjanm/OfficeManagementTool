namespace Inovatec.OfficeManagementTool.Models.ViewModels.Equipment
{
    public class EquipmentViewModel
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public long? UserId { get; set; }
        public string? UserName { get; set; }
        public string? ItemCode { get; set; }
        public string? ItemName { get; set; }
        public long CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime DateCreated { get; set; }
    }
}