using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models;
using Microsoft.AspNetCore.Mvc;

namespace Inovatec.OfficeManagementTool.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderAttachmentController : ControllerBase
    {
        private readonly IOrderAttachmentBL _attachmentBL;

        public OrderAttachmentController(IOrderAttachmentBL attachmentBL)
        {
            _attachmentBL = attachmentBL;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] AttachmentRequest file)
        {
            return Ok(await _attachmentBL.AddAttachment(file));
        }

        [HttpGet]
        public async Task<IActionResult> GetFiles(long id)
        {
            return Ok(await _attachmentBL.GetAttachments(id));
        }

        [HttpGet("Download")]
        public async Task<IActionResult> Download(long id)
        {

            var orderAttachment = await _attachmentBL.Download(id);
            return File(orderAttachment.FileContent, orderAttachment.MimeType, orderAttachment.FileName);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(long id)
        {
            return Ok(await _attachmentBL.DeleteAttachment(id));
        }
    }
}