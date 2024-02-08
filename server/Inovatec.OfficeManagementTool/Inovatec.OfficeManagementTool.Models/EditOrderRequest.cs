namespace Inovatec.OfficeManagementTool.Models
{
    public class EditOrderRequest
    {
        public int UserId { get; set; }
        public long State { get; set; } = -1;
        public long Id { get; set; }
        public long? OfficeId { get; set; }
    }
}