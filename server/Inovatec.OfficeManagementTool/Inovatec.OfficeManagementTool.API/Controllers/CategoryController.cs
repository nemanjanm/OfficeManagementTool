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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryBL _categoryBL;

        public CategoryController(ICategoryBL categoryBL)
        {
            _categoryBL = categoryBL;
        }

        [HttpPost]
        public async Task<IActionResult> InsertCategory(CategoryRequest categoryViewModel)
        {
            return Ok(await _categoryBL.InsertCategory(categoryViewModel));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories([FromQuery]CategoryFilterRequest filterRequest)
        {
            return Ok(await _categoryBL.GetAllCategories(filterRequest));
        }

        [HttpGet("Id")]
        public async Task<IActionResult> GetCategoryById(int Id)
        {
            return Ok(await _categoryBL.GetCategoryById(Id));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory(CategoryRequest categoryViewModel)
        {
            return Ok(await _categoryBL.UpdateCategory(categoryViewModel));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(long id)
        {
            return Ok(await _categoryBL.DeleteCategoryById(id));
        }
    }
}