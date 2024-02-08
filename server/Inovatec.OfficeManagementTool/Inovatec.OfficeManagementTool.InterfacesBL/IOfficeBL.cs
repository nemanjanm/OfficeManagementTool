using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Microsoft.Data.SqlClient;
using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IOfficeBL
    {
        Task<OfficeCreateRequest?> GetById(int id);
        Task<List<OfficeCreateRequest>> GetAll(SearchRequest searchRequest);
        Task<ActionResultResponse<string>> Insert(OfficeCreateRequest item);
        Task<ActionResultResponse<string>> UpdateOfficeName(OfficeCreateRequest item);
        Task<ActionResultResponse<string>> DeleteOffice(long id);
    }
}