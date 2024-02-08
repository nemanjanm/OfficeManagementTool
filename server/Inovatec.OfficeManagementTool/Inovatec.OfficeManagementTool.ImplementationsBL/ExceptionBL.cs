using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class ExceptionBL : IExceptionBL

    {
        private readonly IExceptionDAL _exceptionDAL;

        public ExceptionBL(IExceptionDAL exceptionDAL)
        {
            _exceptionDAL = exceptionDAL;
        }

        public async Task<PagedList<ExceptionLogViewModel>> GetAll(ExceptionFilterRequest searchRequest)
        {
            PagedList<ExceptionLogViewModel> exceptionViews;

            exceptionViews = await _exceptionDAL.GetExceptionsByFilter(searchRequest);

            return exceptionViews;
        }
    }
}