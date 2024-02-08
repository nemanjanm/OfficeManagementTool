using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = $"{Role.Hr}")]
    public class OrderController : Controller
    {
        private readonly IOrderBL _orderBL;

        public OrderController(IOrderBL orderBL)
        {
            _orderBL = orderBL;
        }

        [HttpPost("Order")]
        public async Task<IActionResult> AddOrder(long officeId)
        {
            return Ok(await _orderBL.AddOrder(officeId));
        }

        [HttpPut]
        public async Task<IActionResult> EditOrder(EditOrderRequest editOrder)
        {
            return Ok(await _orderBL.EditOrder(editOrder));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            return Ok(await _orderBL.DeleteOrder(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetOrder()
        {
            return Ok(await _orderBL.GetOrder());
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
        {
            return Ok(await _orderBL.CreateOrder(request));
        }
    }
}