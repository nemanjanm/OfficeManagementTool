using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = $"{Role.Admin},{Role.Hr},{Role.RegularEmployee}")]
    public class ItemController : ControllerBase
    {
        private readonly IItemBL _itemBL;

        public ItemController(IItemBL itemBL)
        {
            _itemBL = itemBL;
        }

        [HttpPost]
        public async Task<IActionResult> InsertItem(ItemRequest itemRequest)
        {
            return Ok(await _itemBL.InsertItem(itemRequest));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateItem(ItemRequest itemRequest)
        {
            return Ok(await _itemBL.UpdateItem(itemRequest));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteItem(long id)
        {
            return Ok(await _itemBL.DeleteItemById(id));
        }

        [HttpGet("Id")]
        public async Task<IActionResult> GetItemById(long Id)
        {
            return Ok(await _itemBL.GetItemById(Id));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllItems([FromQuery] ItemFilterRequest filterRequest)
        {
            return Ok(await _itemBL.GetAllItems(filterRequest));
        }
    }
}