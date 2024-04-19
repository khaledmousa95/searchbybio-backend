// redisDB.js
import Redis from 'ioredis';
import * as dotenv from "dotenv";
dotenv.config();
export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
export async function checkRedisConnection() {
    try {
        const pingResult = await redis.ping();
        console.log(`Redis connection: ${pingResult}`);
    }
    catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1); // Exit the process if Redis connection fails
    }
}
//# sourceMappingURL=redisDB.js.map