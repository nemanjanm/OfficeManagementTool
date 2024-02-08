using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/office")]
    [ApiController]
    [Authorize(Roles = $"{Role.Admin},{Role.Hr}")]
    public class OfficeController : Controller
    {
        private readonly IOfficeBL _officeBL;

        public OfficeController(IOfficeBL officeBL)
        {
            _officeBL = officeBL;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOfficeById(int id)
        {
            return Ok(await _officeBL.GetById(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOffices([FromQuery] SearchRequest searchRequest)
        {
            return Ok(await _officeBL.GetAll(searchRequest));

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffice(int id)
        {
            var response = await _officeBL.DeleteOffice(id);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOfficeName(OfficeCreateRequest request)
        {
            return Ok(await _officeBL.UpdateOfficeName(request));
        }

        [HttpPost]
        public async Task<IActionResult> AddDevice(OfficeCreateRequest office)
        {
            return Ok(await _officeBL.Insert(office));
        }
    }
}
