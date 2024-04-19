    // sessionConfig.js
    import session from "express-session";
    import RedisStore from "connect-redis"
    import IORedis from 'ioredis';
    import * as dotenv from 'dotenv';

    dotenv.config();

    const configureSession = () => {
    const redisClient = new IORedis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    });

    return session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    });
    };
    export default configureSession;
