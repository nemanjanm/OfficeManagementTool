namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class NewPasswordRequest
    {
        public long Id { get; set; }
        public string NewPassword { get; set; }
        public string OldPassword { get; set; }
    }
}