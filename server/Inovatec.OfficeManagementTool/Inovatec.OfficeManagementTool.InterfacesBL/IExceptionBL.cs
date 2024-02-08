using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IExceptionBL
    {
        public Task<PagedList<ExceptionLogViewModel>> GetAll(ExceptionFilterRequest searchRequest);
    }
}