using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface ICategoryDAL : IBaseDAL<Category>
    {
        public Task<PagedList<CategoryViewModel>> GetAllCategories(CategoryFilterRequest filterRequest);
        public Task<Category> GetByName(string name);
        public Task<CategoryViewModel> GetCategoryById(long id);
    }
}