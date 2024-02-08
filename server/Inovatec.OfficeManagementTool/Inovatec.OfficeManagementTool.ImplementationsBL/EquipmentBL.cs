using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Equipment;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class EquipmentBL : IEquipmentBL
    {
        private readonly IEquipmentDAL _equipmentDAL;
        public EquipmentBL(IEquipmentDAL equipmentDAL)
        {
            this._equipmentDAL = equipmentDAL;
        }
        public async Task<ActionResultResponse<string>> DeleteEquipment(long id)
        {
            if (!await _equipmentDAL.CheckIfExistsAsync(id))
            {
                return new ActionResultResponse<string>(null, false, "Equipment.EquipmentDoesntExist");
            }

            await _equipmentDAL.Delete(id);
            await _equipmentDAL.SaveChangesAsync();

            return new ActionResultResponse<string>("Equipment.EquipmentDeleteSucc", true, null);
        }

        public async Task<PagedList<EquipmentViewModel>> GetAll(EquipmentFilterRequest filterRequest)
        {
            PagedList<EquipmentViewModel> equipmentViews;
            if (filterRequest.Assigned == false)
            {
                equipmentViews = await _equipmentDAL.GetEquipmentByFilter(filterRequest);
            } else
            {
                equipmentViews = await _equipmentDAL.GetAssignedEquipmentByFilter(filterRequest);
            }
            
            return equipmentViews;
        }

        public async Task<ActionResultResponse<string>> Insert(EquipmentCreateRequest item)
        {
            Equipment newEquipment = new Equipment();
            var officeByName = await _equipmentDAL.GetAllByFilter(x => x.ItemCode.Equals(item.ItemCode) && !x.IsDeleted);

            if (officeByName.Count > 0)
            {
                return new ActionResultResponse<string>(null, false, "Equipment.ItemCodeExists");
            }

            newEquipment.ItemId = item.ItemId;
            newEquipment.ItemCode = item.ItemCode;

            await _equipmentDAL.Insert(newEquipment);
            await _equipmentDAL.SaveChangesAsync();

            return new ActionResultResponse<string>
            {
                Data = "Equipment.EquipmentAddedSuccessfully",
                Status = true
            };
        }

        public async Task<ActionResultResponse<string>> UpdateUserId(EquipmentCreateRequest item)
        {
            var equipmentById = await _equipmentDAL.GetById(item.Id);

            if (equipmentById == null)
            {
                return new ActionResultResponse<string>(null, false, "Equipment.EquipmentIsNull");
            }
            if(item.UserId == 0)
            {
                equipmentById.UserId = null;
            }
            else
            {
                equipmentById.UserId = item.UserId;
            }

            await _equipmentDAL.Update(equipmentById);
            await _equipmentDAL.SaveChangesAsync();

            return new ActionResultResponse<string>("Equipment.UpdateEquipmentSucc", true, "");
        }
    }
}