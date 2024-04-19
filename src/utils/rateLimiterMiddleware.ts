// utils/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';

// Define rate-limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

export default limiter;
