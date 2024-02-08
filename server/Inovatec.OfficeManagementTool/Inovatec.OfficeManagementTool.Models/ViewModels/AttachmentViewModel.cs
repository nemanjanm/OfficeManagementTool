namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class AttachmentViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long OrderId { get; set; }
        public DateTime DateCreated { get; set; }
    }
}