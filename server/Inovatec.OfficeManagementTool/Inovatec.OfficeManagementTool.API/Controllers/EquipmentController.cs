using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models.ViewModels.Equipment;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : Controller
    {
        private readonly IEquipmentBL _equipmentBL;

        public EquipmentController(IEquipmentBL equipmentBL)
        {
            _equipmentBL = equipmentBL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEquipment([FromQuery] EquipmentFilterRequest searchRequest)
        {
            return Ok(await _equipmentBL.GetAll(searchRequest));

        }

        [HttpGet("{assigned}")]
        public async Task<IActionResult> GetAllAssignedEquipment([FromQuery] EquipmentFilterRequest searchRequest)
        {
            return Ok(await _equipmentBL.GetAll(searchRequest));

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffice(int id)
        {
            var response = await _equipmentBL.DeleteEquipment(id);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEquipmentUser(EquipmentCreateRequest request)
        {
            return Ok(await _equipmentBL.UpdateUserId(request));
        }

        [HttpPost]
        public async Task<IActionResult> AddDevice(EquipmentCreateRequest equipment)
        {
            return Ok(await _equipmentBL.Insert(equipment));
        }
    }
}