using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Auth;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;
using Microsoft.EntityFrameworkCore;
using Inovatec.OfficeManagementTool.Models.ViewModels.Office;
using System.Linq.Expressions;
using Inovatec.OfficeManagementTool.Models.Enum;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class UserDAL : BaseDAL<User>, IUserDAL
    {
        public UserDAL(OfficeManagementTool_IS2023_team2Context context) : base(context)
        {
            
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await table.Include(user => user.Office).FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User?> GetUserByToken(ChangePassword model)
        {
            return await table.Where(x => x.ResetPasswordToken == model.Token && x.ResetPasswordTokenExpirationTime > DateTime.Now).FirstOrDefaultAsync();
        }

        public async Task<bool> CheckEmail(string email, long id = -1)
        {
            if (id != -1)
            {
                return await table.AnyAsync(x => x.Email == email && !x.IsDeleted && x.Id != id);
            }
                
            return await table.AnyAsync(x => x.Email == email && !x.IsDeleted);
        }

        public async Task<PagedList<UserViewModel>> GetUsersPage(UserFilterRequest filter)
        {
            var query = table.Include(user => user.Office).Where(x => !x.IsDeleted)
                .Select(x => new UserViewModel
                {
                    Id = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    Role = x.Role,
                    Office = new OfficeViewModel(x.Office),
                });

            if (!string.IsNullOrEmpty(filter.Search))
            {
                filter.Search = filter.Search.Trim();

                query = query.Where(x => x.FirstName.ToLower().Contains(filter.Search.ToLower()) ||
                                            x.LastName.ToLower().Contains(filter.Search.ToLower()) ||
                                            x.Email.ToLower().Contains(filter.Search.ToLower()));
            }

            if (filter.OfficeId != -1)
            {
                query = query.Where(x => x.Office.Id == filter.OfficeId);
            }

            Expression<Func<UserViewModel, object>> sortFunction = filter.SortField switch
            {
                "lastName" => (user => user.LastName),
                "firstName" => (user => user.FirstName),
                "email" => (user => user.Email),
                _ => (user => user.Id)
            };

            if(filter.SortOrder == 1)
            {
                query = query.OrderBy(sortFunction);
            }
            else
            {
                query = query.OrderByDescending(sortFunction);
            }

            var length = await query.CountAsync();

            int pageIndex = filter.PageIndex ?? 1;
            int pageSize = filter.PageSize ?? 10;

            query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return new PagedList<UserViewModel>(await query.ToListAsync(), length);
        }

        public async Task<bool> CheckIfExistsAsync(long id)
        {
            return await table.AnyAsync(x => !x.IsDeleted && x.Id.Equals(id));
        }

        public async Task<List<string>> GetHRs(long office)
        {
            List<string> hrEmails = await table.Where(x => x.OfficeId == office && x.Role == int.Parse(Role.Hr) && !x.IsDeleted)
                                                .Select(x => x.Email).ToListAsync();
            return hrEmails;
        }

        public async Task<long> GetOfficeIdForUser(long id)
        {
            var query = table.Where(x => !x.IsDeleted && x.Id == id).Select(x => x.OfficeId);
            return await query.FirstOrDefaultAsync();
        }
    }
}