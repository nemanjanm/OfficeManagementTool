using AutoMapper;
using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.Common.EmailService;
using Inovatec.OfficeManagementTool.ImplementationsBL.Helpers;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Auth;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class UserBL : IUserBL
    {
        public readonly IUserDAL _userDAL;
        public readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public UserBL(IUserDAL userDAL, IEmailService emailService, IMapper mapper) 
        {
            _userDAL = userDAL;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<ActionResultResponse<string>> CreateResetToken(string reciever)
        {
            var user = await _userDAL.GetUserByEmail(reciever);

            if (user == null)
            {
                return new ActionResultResponse<string>(null, false, string.Empty);
            }

            string token = Guid.NewGuid().ToString();
            string body = "" +
                "<h1 style=\"color: #333333;  margin-bottom: 20px;\">Reset your password</h1>" +
                " <p style=\"color: #333333;  line-height: 1.5; margin-bottom: 20px;\">Click the button below to take action:</p> " +
                "<a href=\"" + ConfigProvider.ChangePasswordPage + "?token=" + token + "\" style=\"background-color: #4CAF50; display: inline-block; color: #ffffff; padding: 10px 20px;text-decoration: none;border-radius: 5px;\">Click</a>";
            
            await _emailService.SendEmail(reciever, "Reset your password", body, "Change Password");
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpirationTime = DateTime.Now.AddMinutes(ConfigProvider.TokenExpirationTime);

            await _userDAL.Update(user);
            await _userDAL.SaveChangesAsync();
            return  new ActionResultResponse<string>(null, true, "Common.EmailSent");
        }

        public async Task<ActionResultResponse<string>> ChangePassword(ChangePassword changepassword)
        {
            var user = await _userDAL.GetUserByToken(changepassword);

            if (user == null)
            {
                return new ActionResultResponse<string>(null, true, "Common.ExpiredToken");
            }

            user.Password = PasswordService.HashPass(changepassword.Password);

            await _userDAL.Update(user);
            await _userDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "User.succPassChange");
        }

        public async Task<ActionResultResponse<string>> UpdatePassword(NewPasswordRequest request)
        {
            User? updateUser = (await GetUserById(request.Id)).Data;

            if (updateUser == null)
            {
                return new ActionResultResponse<string>(null, false, "User.NoUser");
            }
            else if (PasswordService.VerifyPassword(updateUser.Password, request.OldPassword))
            {
                updateUser.Password = PasswordService.HashPass(request.NewPassword);

                await _userDAL.Update(updateUser);
                await _userDAL.SaveChangesAsync();

                return new ActionResultResponse<string>("User.succPassChange", true, null);
            }

            return new ActionResultResponse<string>(null, false, "User.WrongPassword");
        }

        public async Task<ActionResultResponse<LoginResponse>> AuthenticateUser(string email, string password)
        {
            ActionResultResponse<LoginResponse> res = new ActionResultResponse<LoginResponse>();
            res.Status = false;
            User? user = await _userDAL.GetUserByEmail(email);

            if (user == null)
            {
                res.Errors.Add("User.NoUser");
                return res;
            }

            if (PasswordService.VerifyPassword(user.Password, password))
            {
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.User = _mapper.Map<UserViewModel>(user);
                loginResponse.Token = AuthService.GetJWT(loginResponse.User);
                res.Status = true;
                res.Data = loginResponse;
                return res;
            }

            res.Errors.Add("Common.IncorrPass");
            return res;
        }

        public async Task<ActionResultResponse<User>> AddUser(UserCreateRequest user)
        {
            if (await _userDAL.CheckEmail(user.Email))
            {
                return new ActionResultResponse<User>(null, false, "User.EmailTaken");
            }

            User newUser = _mapper.Map<User>(user);
            newUser.Password = Guid.NewGuid().ToString();

            await _userDAL.Insert(newUser);
            await _userDAL.SaveChangesAsync();

            await CreateResetToken(newUser.Email);

            return new ActionResultResponse<User>(newUser, true, "");
        }

        public async Task<ActionResultResponse<string>> DeleteUser(long id)
        {
            var user = await _userDAL.GetById(id);
            if (user != null && !user.IsDeleted)
            {
                await _userDAL.Delete(id);
                await _userDAL.SaveChangesAsync();

                return new ActionResultResponse<string>("User.EmployeeDeletedMessage", true, "");
            }

            return new ActionResultResponse<string>(null, false, "User.NoUser");
        }

        public async Task<ActionResultResponse<List<User>>> GetAllUsers()
        {
            return new ActionResultResponse<List<User>>(await _userDAL.GetAll(), true, "");
        }

        public async Task<ActionResultResponse<PagedList<UserViewModel>>> GetAllUsersByFilter(UserFilterRequest filter)
        {
            return new ActionResultResponse<PagedList<UserViewModel>>(await _userDAL.GetUsersPage(filter), true, "");
        }

        public async Task<ActionResultResponse<User>> GetUserById(long id)
        {
            User? user = await _userDAL.GetById(id);

            if (user != null)
            {
                return new ActionResultResponse<User>(user, true, "");
            }

            return new ActionResultResponse<User>(null, false, "User.NoUser");
        }

        public async Task<ActionResultResponse<User>> UpdateUser(UserCreateRequest user)
        {
            User? updateUser = (await GetUserById(user.Id)).Data;

            if (updateUser != null)
            {
                if (await _userDAL.CheckEmail(user.Email, user.Id))
                {
                    return new ActionResultResponse<User>(null, false, "User.EmailTaken");

                }

                updateUser.FirstName = user.FirstName;
                updateUser.LastName = user.LastName;
                updateUser.Email = user.Email;
                updateUser.Role = user.Role;
                updateUser.OfficeId = user.OfficeId;

                await _userDAL.Update(updateUser);
                await _userDAL.SaveChangesAsync();
                return new ActionResultResponse<User>(updateUser, true, "");
            }
                
            return new ActionResultResponse<User>(null, false, "User.NoUser");
        }

        public async Task<ActionResultResponse<User>> UpdateUserName(UserCreateRequest user)
        {
            User? updateUser = (await GetUserById(user.Id)).Data;

            if (updateUser != null)
            {
                updateUser.FirstName = user.FirstName;
                updateUser.LastName = user.LastName;

                await _userDAL.Update(updateUser);
                await _userDAL.SaveChangesAsync();

                return new ActionResultResponse<User>(updateUser, true, null);
            }

            return new ActionResultResponse<User>(null, false, "User.NoUser");
        }

        public async Task<ActionResultResponse<long>> GetOfficeIdForUser(long id)
        {
            return new ActionResultResponse<long>(await _userDAL.GetOfficeIdForUser(id),true, "ok");
        }
    }
}