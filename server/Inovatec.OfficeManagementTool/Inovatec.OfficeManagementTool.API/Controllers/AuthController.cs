using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserBL _userBL;

        public AuthController(IUserBL userBL)
        {
            _userBL = userBL;
        }

        [HttpPost("{email}")]
        public async Task<IActionResult> SendResetPasswordEmail(string email)
        {
            return Ok(await _userBL.CreateResetToken(email));
        }

        [HttpPost("change-password")]
        public async Task<ActionResult<ActionResultResponse<string>>> ChangePassword(ChangePassword model)
        {
            return Ok(await _userBL.ChangePassword(model));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo loginInfo)
        {
            ActionResultResponse<LoginResponse> response;

            if (loginInfo == null)
            {
                response = new ActionResultResponse<LoginResponse>();
                response.Status = false;
                response.Errors.Add("Login credentials not sent.");
            }
            else
            {
                response = await _userBL.AuthenticateUser(loginInfo.Email, loginInfo.Password);
            }
            return Ok(response);
        }
    }
}