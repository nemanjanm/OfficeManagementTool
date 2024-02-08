using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Equipment;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IEquipmentBL
    {
        Task<PagedList<EquipmentViewModel>> GetAll(EquipmentFilterRequest filterRequest);
        Task<ActionResultResponse<string>> Insert(EquipmentCreateRequest item);
        Task<ActionResultResponse<string>> UpdateUserId(EquipmentCreateRequest item);
        Task<ActionResultResponse<string>> DeleteEquipment(long id);
    }
}