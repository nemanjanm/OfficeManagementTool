namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class ExceptionLogViewModel
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime? TimeStamp { get; set; }
        public string Exception { get; set; }
        public string? UserName { get; set; }
    }
}