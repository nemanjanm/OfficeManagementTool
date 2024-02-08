namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class OrderViewModel
    {
        public long Id { get; set; }
        public long OfficeId { get; set; }
        public long State { get; set; }
        public DateTime DateCreated { get; set; }
    }
}