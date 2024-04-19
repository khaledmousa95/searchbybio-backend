// app.js
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRouter.js';
import userRoutes from './routes/usersRouter.js';
import searchRoutes from './routes/searchRouter.js';
import limiter from './utils/rateLimiterMiddleware.js';
import { checkRedisConnection } from './utils/redisDB.js';
import configureSession from './middleware/SessionConfig.js'; // Import the session configuration
import compression from 'compression';
const app = express();
const port = 8080;
// Cors config
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Allow credentials (e.g., cookies)
}));
// Security middleware
app.use(helmet());
app.use(hpp());
// .env config
dotenv.config();
// Configure session middleware
app.use(configureSession());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
// app.use(sanitizeUserInput); // Use the sanitize middleware
app.use(cookieParser());
// Applying rate-limiting middleware to all routes for ip of 15 requsts a mintue and 100 an hour
app.use(limiter);
// error handling for status 500
app.use(errorHandler);
app.use(compression());
// Search routes
app.use('/api/v1/search', searchRoutes);
// User routes
app.use('/api/v1/users', userRoutes);
// Admin routes 
app.use('/api/v1/admin', adminRoutes);
app.use(express.static('public'));
// app.use(errorHandler)
checkRedisConnection().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
//# sourceMappingURL=index.js.map