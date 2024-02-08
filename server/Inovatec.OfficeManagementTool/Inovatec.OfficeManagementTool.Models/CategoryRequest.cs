namespace Inovatec.OfficeManagementTool.Models
{
    public class CategoryRequest
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CategoryType { get; set; }
    }
}
