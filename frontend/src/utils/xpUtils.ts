// utils/xpUtils.ts
export const getXPForDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
        case 'easy':
            return 10;
        case 'medium':
            return 20;
        case 'hard':
            return 30;
        default:
            throw new Error('Invalid difficulty level');
    }
};