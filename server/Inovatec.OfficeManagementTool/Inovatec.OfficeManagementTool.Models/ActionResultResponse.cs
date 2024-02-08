namespace Inovatec.OfficeManagementTool.Models
{
    public class ActionResultResponse<T>
    {
        public ActionResultResponse()
        {
            Errors = new List<string>();
        }

        public ActionResultResponse(T? data, bool status, string error)
        {
            Data = data;
            Errors = new List<string>();
            Status = status;
            Errors.Add(error);
        }

        public T? Data { get; set; }
        public List<string> Errors { get; set; }
        public bool Status { get; set; }
    }
}
