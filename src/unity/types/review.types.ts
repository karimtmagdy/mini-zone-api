export const REVIEW_STATUS = ["pending", "completed", "failed"] as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[number];
