export enum State{
    PENDING,
    IN_PROGRESS,
    DONE,
    CANCELLED
}

export const States = [
    { label: "Pending", value: State.PENDING },
    { label: "In Progress", value: State.IN_PROGRESS },
    { label: "Done", value: State.DONE },
    { label: "Cancelled", value: State.CANCELLED }
]