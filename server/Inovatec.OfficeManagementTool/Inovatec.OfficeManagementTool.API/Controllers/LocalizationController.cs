using Inovatec.OfficeManagementTool.Localization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalizationController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> GetTranslation(string lang) 
        {
            return Ok(Localizator.GetJsonResources(lang));
        }
    }
}