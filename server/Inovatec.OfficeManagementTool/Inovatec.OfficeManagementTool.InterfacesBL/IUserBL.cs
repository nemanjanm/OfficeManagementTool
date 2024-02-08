using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Auth;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public  interface IUserBL
    {
        Task<ActionResultResponse<string>> CreateResetToken(string email);
        Task<ActionResultResponse<string>> ChangePassword(ChangePassword changepassword);
        Task<ActionResultResponse<LoginResponse>> AuthenticateUser(string email, string password);
        public Task<ActionResultResponse<List<User>>> GetAllUsers();
        public Task<ActionResultResponse<PagedList<UserViewModel>>> GetAllUsersByFilter(UserFilterRequest filter);
        public Task<ActionResultResponse<User>> GetUserById(long id);
        public Task<ActionResultResponse<User>> AddUser(UserCreateRequest user);
        public Task<ActionResultResponse<User>> UpdateUser(UserCreateRequest user);
        public Task<ActionResultResponse<User>> UpdateUserName(UserCreateRequest user);
        public Task<ActionResultResponse<string>> UpdatePassword(NewPasswordRequest request);
        public Task<ActionResultResponse<string>> DeleteUser(long id);
        public Task<ActionResultResponse<long>> GetOfficeIdForUser(long id);
    }
}