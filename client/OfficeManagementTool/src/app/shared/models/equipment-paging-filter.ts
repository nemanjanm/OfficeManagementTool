export class EquipmentPagingFilter
{
    PageIndex: number = 1
    PageSize: number = 10
    Search: string = ''
    UserId: number = 0
    SortField: any = ''
    SortOrder: any = 1
    Assigned: any = false

    constructor(pageIndex: number, pageSize: number, search: string, userId: number, sortField: any, sortOrder: any, assigned: any) {
        this.PageIndex = pageIndex;
        this.PageSize = pageSize;
        this.Search = search;
        this.UserId = userId;
        this.SortField = sortField;
        this.SortOrder = sortOrder;
        this.Assigned = assigned;
    }
}