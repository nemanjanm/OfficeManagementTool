export interface RequestOrderFilter{
    pageIndex?: number,
    pageSize?: number,
    byUser?: number,
    byOffice?: number,
    sortField?: string,
    sortOrder?: number
}