using Inovatec.OfficeManagementTool.Models.ViewModels.Office;

namespace Inovatec.OfficeManagementTool.Models.ViewModels.User
{
    public class UserViewModel
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Role { get; set; }
        public OfficeViewModel Office { get; set; }
    }
}
