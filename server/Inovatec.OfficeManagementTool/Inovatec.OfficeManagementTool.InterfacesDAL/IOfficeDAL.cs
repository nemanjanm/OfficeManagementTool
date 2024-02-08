using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IOfficeDAL : IBaseDAL<Office>
    {
        public Task<List<OfficeCreateRequest>> GetOfficesByFilter(SearchRequest searchRequest);
        public Task<bool> CheckIfExistsAsync(long id);
        public Task<List<OfficeCreateRequest>> GetOffices();
    }
}