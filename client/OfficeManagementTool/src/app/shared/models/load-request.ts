export interface LoadRequest{
    sortCategory?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: -1 | 1;
    currentPage?: number;
    pageSize?: number;
    sortCategoryName?: number;
    categoryType?: number;
}