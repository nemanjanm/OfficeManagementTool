export interface ActionResultResponse<T> {
    errors: string[],
    success: boolean,
    data: T
}