export enum ReportCategories {
    NOT_WORKING,
    DAMAGED,
    HAS_ISSUES,
    MISSING,
    OTHER
}

export const ReportCategoryConstants = [
    { label: "NotWorking", value: ReportCategories.NOT_WORKING },
    { label: "Damaged", value: ReportCategories.DAMAGED },
    { label: "HasIssues", value: ReportCategories.HAS_ISSUES },
    { label: "Missing", value: ReportCategories.MISSING },
    { label: "Other", value: ReportCategories.OTHER }
]