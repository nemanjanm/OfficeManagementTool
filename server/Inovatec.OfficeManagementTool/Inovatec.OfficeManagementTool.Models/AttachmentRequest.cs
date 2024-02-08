using Microsoft.AspNetCore.Http;

namespace Inovatec.OfficeManagementTool.Models
{
    public class AttachmentRequest
    {
        public long Id { get; set; }
        public IFormFile file { get; set; }
    }
}