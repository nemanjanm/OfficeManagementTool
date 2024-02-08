using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class OfficeBL : IOfficeBL
    {
        private readonly IOfficeDAL _officeDAL;

        public OfficeBL(IOfficeDAL officeDAL)
        {
            _officeDAL = officeDAL;
        }

        public async Task<ActionResultResponse<string>> DeleteOffice(long id)
        {
            if (!await _officeDAL.CheckIfExistsAsync(id))
            {
                return new ActionResultResponse<string>(null,false, "Offices.OfficeDoesntExist");
            }

            await _officeDAL.Delete(id);
            await _officeDAL.SaveChangesAsync();

            return new ActionResultResponse<string>("Offices.OfficeDeleteSucc", true,null);
        }

        public async Task<OfficeCreateRequest?> GetById(int id)
        {
            var office = await _officeDAL.GetById(id);

            OfficeCreateRequest officeView = new OfficeCreateRequest()
            {
                Id = office.Id,
                Name = office.Name, 
                IsDeleted = office.IsDeleted
            };

            return officeView;
        }

        public async Task<List<OfficeCreateRequest>> GetAll(SearchRequest searchRequest)
        {
            List<OfficeCreateRequest> officeViews = new List<OfficeCreateRequest>();

            if ( !string.IsNullOrEmpty(searchRequest.SearchTerm) || (!string.IsNullOrEmpty(searchRequest.SortField) && !string.IsNullOrEmpty(searchRequest.SortOrder)) ) {
                officeViews = await _officeDAL.GetOfficesByFilter(searchRequest);
            }
            else
            {
                officeViews = await _officeDAL.GetOffices();
            }

            return officeViews;
        }

        public async Task<ActionResultResponse<string>> Insert(OfficeCreateRequest item)
        {
            Office newOffice = new Office();
            var officeByName = await _officeDAL.GetAllByFilter(x => x.Name.Equals(item.Name) && !x.IsDeleted);

            if (officeByName.Count > 0)
            {
                return new ActionResultResponse<string>(null, false, "Offices.OfficeNameExists");
            }

            newOffice.Name = item.Name;

            await _officeDAL.Insert(newOffice);
            await _officeDAL.SaveChangesAsync();

            return new ActionResultResponse<string> {
                Data = "Offices.OfficeAddedSuccessfully", 
                Status = true
            };
        }

        public async Task<ActionResultResponse<string>> UpdateOfficeName(OfficeCreateRequest item)
        {
            var officeById = await _officeDAL.GetById(item.Id ?? 0);
            var officeByName = await _officeDAL.GetAllByFilter(x => x.Name.Equals(item.Name));

            if (officeById == null)
            {
                return new ActionResultResponse<string>(null, false, "Offices.OfficeIsNull");
            }

            if(officeByName.Count > 0)
            {
                return new ActionResultResponse<string>(null, false, "Offices.OfficeNameExists");
            }

            officeById.Name = item.Name;
            
            await _officeDAL.Update(officeById);
            await _officeDAL.SaveChangesAsync();

            return new ActionResultResponse<string>("Offices.UpdateOfficeSucc", true, "");
        }
    }
}