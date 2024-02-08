export interface ReportFilterRequest{
    first?: number,
    rows?: number,
    sortBy?: string,
    order?: number,
    searchDescription?: string,
    state?: number,
    searchOffice?: string,
    searchUser?: string,
    category?: number
    userId?: number
}