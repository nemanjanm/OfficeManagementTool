export class UserPagingFilters
{
    search: string = ''
    pageIndex: number = 1
    pageSize: number = 10
    officeId: number = -1;
    sortField: any = ''
    sortOrder: any = 1

    constructor(search: string, pageIndex: number, pageSize: number, officeId: number, sortField: any, sortOrder: any) {
        this.search = search;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.officeId = officeId;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }
}