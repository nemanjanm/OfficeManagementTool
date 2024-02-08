using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface ICategoryBL
    {
        public Task<ActionResultResponse<string>> InsertCategory(CategoryRequest categoryViewModel);
        public Task<ActionResultResponse<string>> UpdateCategory(CategoryRequest categoryViewModel);
        public Task<PagedList<CategoryViewModel>> GetAllCategories(CategoryFilterRequest filterRequest);
        public Task<ActionResultResponse<CategoryViewModel>> GetCategoryById (long Id);
        public Task<ActionResultResponse<string>> DeleteCategoryById (long Id);
    }
}