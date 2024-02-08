using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels.Equipment;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IEquipmentDAL : IBaseDAL<Equipment>
    {
        public Task<PagedList<EquipmentViewModel>> GetEquipmentByFilter(EquipmentFilterRequest searchRequest);
        public Task<PagedList<EquipmentViewModel>> GetAssignedEquipmentByFilter(EquipmentFilterRequest searchRequest);
        public Task<bool> CheckIfExistsAsync(long id);
        public Task<PagedList<EquipmentViewModel>> GetEquipment();
    }
}