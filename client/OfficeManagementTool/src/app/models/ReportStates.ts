export enum ReportStates{
    PENDING,
    IN_PROGRESS,
    DONE,
    CANCELLED
}

export const ReportStateConstants = [
    { label: "Pending", value: ReportStates.PENDING },
    { label: "InProgress", value: ReportStates.IN_PROGRESS },
    { label: "Done", value: ReportStates.DONE },
    { label: "Cancelled", value: ReportStates.CANCELLED }
]