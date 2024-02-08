using Inovatec.OfficeManagementTool.Models.ViewModels.User;

namespace Inovatec.OfficeManagementTool.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public UserViewModel User { get; set; }
    }
}
