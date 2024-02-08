export interface EquipmentSearchViewModel {
    skip: number,
    limit: number,
    searchTerm?: string,
    sortField: string,
    sortOrder: number,
    categoryIdFilter?: any
}