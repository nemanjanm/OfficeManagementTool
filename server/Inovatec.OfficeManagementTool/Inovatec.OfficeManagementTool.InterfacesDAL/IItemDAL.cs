using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IItemDAL : IBaseDAL<Item>
    {
        public Task<PagedList<ItemViewModel>> GetAllItems(ItemFilterRequest filterRequest);
        public Task<bool> CheckIfExistsAsync(long id);
    }
}