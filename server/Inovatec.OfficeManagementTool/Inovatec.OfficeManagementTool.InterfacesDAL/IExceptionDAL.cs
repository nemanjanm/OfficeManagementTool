using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IExceptionDAL : IBaseDAL<ExceptionLog>
    {
        public Task<PagedList<ExceptionLogViewModel>> GetExceptionsByFilter(ExceptionFilterRequest searchRequest);
    }
}