using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.InterfacesBL
{
    public interface IItemBL
    {
        public Task<ActionResultResponse<string>> InsertItem(ItemRequest itemRequest);
        public Task<ActionResultResponse<string>> UpdateItem(ItemRequest itemRequest);
        public Task<ActionResultResponse<PagedList<ItemViewModel>>> GetAllItems(ItemFilterRequest filterRequest);
        public Task<ActionResultResponse<ItemViewModel>> GetItemById(long Id);
        public Task<ActionResultResponse<string>> DeleteItemById(long Id);
    }
}