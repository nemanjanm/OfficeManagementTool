namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class OrderItemViewModel
    {
        public long Id { get; set; } 
        public long ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public long OrderId { get; set; }
        public int Amount { get; set; }
    }
}