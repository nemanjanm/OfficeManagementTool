namespace Inovatec.OfficeManagementTool.Models
{
    public class ItemRequest
    {
        public long? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }
}