using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class OrderAttachmentBL : IOrderAttachmentBL
    {
        public IOrderAttachmentDAL _orderAttachmentDAL;
        public IOrderDAL _orderDAL;
        public OrderAttachmentBL(IOrderAttachmentDAL _orderAttachmentDAL, IOrderDAL orderDAL) 
        {
            this._orderAttachmentDAL = _orderAttachmentDAL;
            this._orderDAL = orderDAL;
        }
        public async Task<ActionResultResponse<string>> AddAttachment(AttachmentRequest attachment)
        {
            var order = await _orderDAL.GetById(attachment.Id);

            if (order == null || order.IsDeleted) 
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            OrderAttachment orderAttachment = new OrderAttachment();
            orderAttachment.FileName = attachment.file.FileName;
            orderAttachment.MimeType = attachment.file.ContentType;

            using (var stream = new MemoryStream())
            {
                attachment.file.CopyTo(stream);
                var bytes = stream.ToArray();
                orderAttachment.FileContent = bytes;
            }
            orderAttachment.OrderId = attachment.Id;

            await _orderAttachmentDAL.Insert(orderAttachment);
            await _orderAttachmentDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfuly added attachments");
        }

        public async Task<ActionResultResponse<string>> DeleteAttachment(long id)
        {
            var attachment = await _orderAttachmentDAL.GetById(id);

            if (attachment == null || attachment.IsDeleted)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            await _orderAttachmentDAL.Delete(attachment.Id);
            await _orderAttachmentDAL.SaveChangesAsync();

            return new ActionResultResponse<string>(null, true, "Successfuly deleted attachment");
        }

        public async Task<List<AttachmentViewModel>> GetAttachments(long id)
        {
            List<OrderAttachment> list = await _orderAttachmentDAL.GetAllByFilter((filter) => filter.OrderId == id && !filter.IsDeleted); 

            List<AttachmentViewModel> result = new List<AttachmentViewModel>();

            foreach (var attachment in list)
            {
                AttachmentViewModel orderAttachment = new AttachmentViewModel();
                orderAttachment.Id = attachment.Id;
                orderAttachment.OrderId = attachment.OrderId;
                orderAttachment.DateCreated = attachment.DateCreated;
                orderAttachment.Name = attachment.FileName;
                orderAttachment.MimeType = attachment.MimeType;

                result.Add(orderAttachment);
            }

            return result;
        }

        public async Task<OrderAttachment> Download(long id)
        {
            OrderAttachment attachment = await _orderAttachmentDAL.GetById(id);
            
            if (attachment == null || attachment.IsDeleted)
            {
                return null;
            }

            return attachment;
        }
    }
}