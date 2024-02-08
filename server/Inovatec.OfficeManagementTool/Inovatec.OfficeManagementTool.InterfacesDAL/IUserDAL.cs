using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Auth;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IUserDAL : IBaseDAL<User>
    {
        public Task<User?> GetUserByEmail(string email);
        public Task<User?> GetUserByToken(ChangePassword model);
        public Task<PagedList<UserViewModel>> GetUsersPage(UserFilterRequest filter);
        public Task<bool> CheckEmail(string email, long id = -1);
        public Task<List<string>> GetHRs(long office);
        public Task<bool> CheckIfExistsAsync(long id);
        public Task<long> GetOfficeIdForUser(long id);
    }
}