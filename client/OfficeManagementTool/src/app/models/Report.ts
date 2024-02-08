export interface Report{
    id: number,
    officeId: number,
    userId: number,
    description: string,
    state: number,
    equipmentId: number,
    category: number,
    dateCreated: Date,
    userFullName: string,
    categoryName: string,
    officeName: string,
    stateName: string
}