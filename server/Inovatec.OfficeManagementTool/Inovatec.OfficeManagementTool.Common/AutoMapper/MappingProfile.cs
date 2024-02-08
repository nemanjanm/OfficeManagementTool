using AutoMapper;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.Enum;
using Inovatec.OfficeManagementTool.Models.ViewModels;
using Inovatec.OfficeManagementTool.Models.ViewModels.Report;
using Inovatec.OfficeManagementTool.Models.ViewModels.Scheduler;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;

namespace Inovatec.OfficeManagementTool.Common.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserViewModel>();
            CreateMap<Item, ItemViewModel>()
                .ForMember(
                    dest => dest.CategoryType,
                    opt => opt.MapFrom(src => src.Category.CategoryType)
                 )
                .ForMember(
                    dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category.Name)
                );
            CreateMap<Item, ItemViewModel>();
            CreateMap<Report, ReportViewModel>()
                .ForMember(dest => dest.UserFullName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => Enum.GetName(typeof(Categories), src.Category)))
                .ForMember(dest => dest.StateName, opt => opt.MapFrom(src => Enum.GetName(typeof(States), src.State)))
                .ForMember(dest => dest.OfficeName, opt => opt.MapFrom(src => src.Office.Name));
            CreateMap<UserCreateRequest, User>();
            CreateMap<ReportCreateRequest, Report>();
            CreateMap<SchedulerCreateRequest, Scheduler>();
        }
    }
}