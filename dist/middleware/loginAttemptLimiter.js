// rateLimit.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Define rate limit parameters (e.g., max attempts and time window)
const MAX_LOGIN_ATTEMPTS = 10;
const TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
// Function to check user login rate limit
export const RateLimiterMiddleWare = async (userId) => {
    const currentTime = new Date();
    const startTime = new Date(currentTime.getTime() - TIME_WINDOW_MS);
    // Count login attempts for the user within the time window
    const loginAttemptsCount = await prisma.loginAttempt.count({
        where: {
            userId: userId,
            createdAt: { gte: startTime, lte: currentTime },
        },
    });
    // Check if the number of login attempts exceeds the limit
    return loginAttemptsCount < MAX_LOGIN_ATTEMPTS;
};
//# sourceMappingURL=loginAttemptLimiter.js.map