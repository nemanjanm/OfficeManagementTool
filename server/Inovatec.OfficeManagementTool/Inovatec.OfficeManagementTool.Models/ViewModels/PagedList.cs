namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class PagedList<T>
    {
        public List<T> Data { get; set; }
        public int TotalRecords { get; set; }

        public PagedList(List<T> list, int totalCount)
        {
            Data = list;
            TotalRecords = totalCount;
        }
    }
}