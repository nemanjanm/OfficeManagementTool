using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemBL _orderItemBL;

        public OrderItemController(IOrderItemBL orderItemBL)
        {
            _orderItemBL = orderItemBL;
        }

        [HttpPost]
        public async Task<IActionResult> AddOrderItem(OrderitemRequest orderRequest)
        {
            return Ok(await _orderItemBL.AddOrderItem(orderRequest));
        }

        [HttpPut]
        public async Task<IActionResult> EditOrder(OrderitemRequest orderRequest)
        {
            return Ok(await _orderItemBL.EditOrder(orderRequest));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteOrderItem(long id)
        {
            return Ok(await _orderItemBL.DeleteItemOrder(id));
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetAllOrderItem(long id)
        {
            return Ok(await _orderItemBL.GetAllOrderItem(id));
        }
    }
}