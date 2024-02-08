using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/exception")]
    [ApiController]
    [Authorize(Roles = $"{Role.Admin}")]
    public class ExceptionController : Controller
    {
        private readonly IExceptionBL _exceptionBL;

        public ExceptionController(IExceptionBL exceptionBL)
        {
            this._exceptionBL = exceptionBL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllExceptions([FromQuery] ExceptionFilterRequest searchRequest)
        {
            return Ok(await _exceptionBL.GetAll(searchRequest));
        }
    }
}