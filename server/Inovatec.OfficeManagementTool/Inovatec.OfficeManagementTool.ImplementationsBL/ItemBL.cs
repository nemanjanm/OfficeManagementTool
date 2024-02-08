using AutoMapper;
using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.Entity;
using Inovatec.OfficeManagementTool.Models.ViewModels;

namespace Inovatec.OfficeManagementTool.ImplementationsBL
{
    public class ItemBL : IItemBL
    {
        private readonly IItemDAL _itemDAL;
        public readonly IMapper _mapper;

        public ItemBL(IItemDAL itemDAL, IMapper mapper)
        {
            _itemDAL = itemDAL;
            _mapper = mapper;
        }

        public async Task<ActionResultResponse<string>> DeleteItemById(long Id)
        {
            var item = await _itemDAL.GetById(Id);

            if (item == null)
            {
                return new ActionResultResponse<string>(null, false, "This item does not exists");
            }

            await _itemDAL.Delete(Id);
            await _itemDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully deleted item");
        }

        public async Task<ActionResultResponse<PagedList<ItemViewModel>>> GetAllItems(ItemFilterRequest filterRequest)
        {
            PagedList<ItemViewModel> list = await _itemDAL.GetAllItems(filterRequest);
            return new ActionResultResponse<PagedList<ItemViewModel>>(list, true, null);
        }

        public async Task<ActionResultResponse<ItemViewModel>> GetItemById(long Id)
        {
            ItemViewModel itemResponse = new ItemViewModel();
            var item = await _itemDAL.GetById(Id);
            
            if (item == null)
            {
                return new ActionResultResponse<ItemViewModel>(null, false, "Something went wrong");
            }

            itemResponse = _mapper.Map<ItemViewModel>(item);
            return new ActionResultResponse<ItemViewModel>(itemResponse, true, null);
        }

        public async Task<ActionResultResponse<string>> InsertItem(ItemRequest itemRequest)
        {
            Item item = new Item();
            item.Name = itemRequest.Name;
            item.CategoryId = itemRequest.CategoryId;
            await _itemDAL.Insert(item);
            await _itemDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully added item");
        }

        public async Task<ActionResultResponse<string>> UpdateItem(ItemRequest itemRequest)
        {
            if (itemRequest.Id == null)
            {
                return new ActionResultResponse<string>(null, false, "Can't update item");
            }

            var item = await _itemDAL.GetById((long)itemRequest.Id); 
            
            if (item == null)
            {
                return new ActionResultResponse<string>(null, false, "Something went wrong");
            }

            item.Name = itemRequest.Name;
            item.CategoryId = itemRequest.CategoryId;
            await _itemDAL.Update(item);
            await _itemDAL.SaveChangesAsync();
            return new ActionResultResponse<string>(null, true, "Successfully updated item");

        }
    }
}