using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;
namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IOrderAttachmentBL
    {
        public Task<ActionResultResponse<string>> AddAttachment(AttachmentRequest file);
        public Task<List<AttachmentViewModel>> GetAttachments(long id);
        public Task<ActionResultResponse<string>> DeleteAttachment(long id);
        public Task<OrderAttachment> Download(long id);
    }
}