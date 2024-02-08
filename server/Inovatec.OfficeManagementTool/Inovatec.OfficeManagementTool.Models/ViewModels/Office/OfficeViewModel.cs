namespace Inovatec.OfficeManagementTool.Models.ViewModels.Office
{
    public class OfficeViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }

        public OfficeViewModel() {}
        public OfficeViewModel(long id, string name)
        {
            Id = id;
            Name = name;
        }
        public OfficeViewModel(Entity.Office office)
        {
            Id = office.Id;
            Name = office.Name;
        }
    }
}
