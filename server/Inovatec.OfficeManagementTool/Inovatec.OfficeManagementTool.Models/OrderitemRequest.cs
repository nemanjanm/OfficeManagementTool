namespace Inovatec.OfficeManagementTool.Models
{
    public class OrderitemRequest
    {
        public long UserId { get; set; }
        public long Id { get; set; }
        public long ItemId { get; set; }
        public long OrderId { get; set; }  
        public int Amount { get; set; }
    }
}