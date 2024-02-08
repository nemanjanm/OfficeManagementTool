export interface OrderRequestViewModel{
    id: number,
    userId: number,
    username: string,
    itemId: number,
    itemName: string,
    amount: number,
    officeId: number,
    officeName: string,
    inOrder: boolean
}