export interface ReportCreateRequest{
    userId: number,
    description: string,
    officeId: number,
    category: number,
    equipmentId?: number
}