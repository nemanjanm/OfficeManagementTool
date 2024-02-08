using Inovatec.OfficeManagementTool.Models.Entity;

namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class ItemViewModel
    {   
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public long CategoryId { get; set; }
        public long CategoryType { get; set; }
    }
}