using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderRequestController : ControllerBase
    {
        private readonly IOrderRequestBL _orderRequestBL;

        public OrderRequestController(IOrderRequestBL orderRequestBL)
        {
            _orderRequestBL = orderRequestBL;
        }

        [HttpPost]
        public async Task<IActionResult> AddOrderRequest(OrderRequestRequest request)
        {
            return Ok( await _orderRequestBL.AddOrderRequest(request));
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderRequest([FromQuery]RequestOrderFilter request)
        {
            return Ok(await _orderRequestBL.GetAllOrderRequest(request));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteOrderRequest(long id)
        {
            return Ok(await _orderRequestBL.DeleteOrderRequest(id));
        }

        [HttpPut]
        public async Task<IActionResult> EditOrderRequest(OrderRequestRequest request)
        {
            return Ok(await _orderRequestBL.EditOrderRequest(request));
        }
    }
}