namespace Inovatec.OfficeManagementTool.Models.ViewModels.User
{
    public class UserCreateRequest
    {
        public long Id { get; set; }
        public long OfficeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Role { get; set; }
        public string Email { get; set; }
    }
}