export const PointsByDifficulty = {
    EASY: 3,
    MEDIUM: 5,
    HARD: 10,
};

export const RewardType = {
    QUESTION_CREATED: "question_created",
    SUBMISSION_CREATED: "submission_created",
    TEST_CASE_CREATED: "test_case_created",
} as const;

export type RewardType = (typeof RewardType)[keyof typeof RewardType];
