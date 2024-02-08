namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class OfficeCreateRequest
    {
        public long? Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DateCreated { get; set; }
    }
}