using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class CategoryBL : ICategoryBL
    {
        private readonly ICategoryDAL _categoryDAL;

        public CategoryBL(ICategoryDAL categoryDAL)
        {
            _categoryDAL = categoryDAL;
        }

        public async Task<ActionResultResponse<string>> InsertCategory(CategoryRequest categoryViewModel)
        {
            Category category = new Category();
            category.Name = categoryViewModel.Name;
            category.CategoryType = categoryViewModel.CategoryType;

            var name = await _categoryDAL.GetByName(categoryViewModel.Name);
            if(name != null) 
            {
                return new ActionResultResponse<string>(null, false, "Category name allready exists");
            }
            await _categoryDAL.Insert(category);
            await _categoryDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully added category");
        }

        public async Task<ActionResultResponse<string>> DeleteCategoryById(long Id)
        {
            var category = await _categoryDAL.GetById(Id);

            if (category == null)
            {
                return new ActionResultResponse<string>(null, false, "This category does not exists");
            }

            await _categoryDAL.Delete(Id);
            await _categoryDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully deleted category");
        }

        public async Task<PagedList<CategoryViewModel>> GetAllCategories(CategoryFilterRequest filterRequest)
        {
            return await _categoryDAL.GetAllCategories(filterRequest);
        }

        public async Task<ActionResultResponse<CategoryViewModel>> GetCategoryById(long Id)
        {
            var category  = await _categoryDAL.GetCategoryById(Id);

            return new ActionResultResponse<CategoryViewModel>(category, false, "Can't update item");
        }

        public async Task<ActionResultResponse<string>> UpdateCategory(CategoryRequest categoryViewModel)
        {
            var category = await _categoryDAL.GetById(categoryViewModel.Id);
            
            if (category == null)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            category.CategoryType = (int) categoryViewModel.CategoryType;
            category.Name = categoryViewModel.Name;
            await _categoryDAL.Update(category);
            await _categoryDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully added category");
        }
    }
}