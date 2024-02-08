export class ExceptionPagingFilter
{
    PageIndex: number = 1
    PageSize: number = 10
    Search: string = ''
    SortField: any = ''
    SortOrder: any = 1

    constructor(pageIndex: number, pageSize: number, search: string, sortField: any, sortOrder: any) {
        this.PageIndex = pageIndex;
        this.PageSize = pageSize;
        this.Search = search;
        this.SortField = sortField;
        this.SortOrder = sortOrder;
    }
}