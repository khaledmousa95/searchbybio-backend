// utils/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';
// Define rate-limiting middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
export default limiter;
//# sourceMappingURL=rateLimiterMiddleware.js.map