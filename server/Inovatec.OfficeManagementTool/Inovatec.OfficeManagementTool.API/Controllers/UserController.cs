using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = $"{Role.Admin},{Role.Hr}")]
    public class UserController : Controller
    {
        private readonly IUserBL _userBL;

        public UserController(IUserBL userBL)
        {
            _userBL = userBL;
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _userBL.GetAllUsers());
        }

        [HttpGet("Pages")]
        public async Task<IActionResult> GetAllUsersByFilter([FromQuery] UserFilterRequest filter)
        {
            return Ok(await _userBL.GetAllUsersByFilter(filter));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] long id)
        {
            return Ok(await _userBL.GetUserById(id));
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(UserCreateRequest user)
        {
            return Ok(await _userBL.AddUser(user));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UserCreateRequest user)
        {
            return Ok(await _userBL.UpdateUser(user));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] long id) 
        {
            return Ok(await _userBL.DeleteUser(id));
        }
    }
}