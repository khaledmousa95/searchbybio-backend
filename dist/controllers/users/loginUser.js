import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import validator from 'validator';
import { RateLimiterMiddleWare } from '../../middleware/loginAttemptLimiter.js';
import { redis } from '../../utils/redisDB.js';
import configureSession from '../../middleware/SessionConfig.js';
const prisma = new PrismaClient();
dotenv.config();
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // valiadting email and password using many libaries/methods
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please use a proper email' });
        }
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (!email || !password || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please login using a proper email' });
        }
        // checking if the user actually exists
        const userCheck = await prisma.users.findFirst({
            where: { email: email },
        });
        if (!userCheck) {
            return res.status(401).json({ message: 'Invalid password or email' });
        }
        const loginAllowed = await RateLimiterMiddleWare(userCheck.id);
        if (!loginAllowed) {
            return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
        }
        // Validate user password
        const passwordMatchCheck = await bcrypt.compare(password, userCheck.password);
        if (!passwordMatchCheck) {
            const ipAddress = req.ip || 'Unknown';
            // Fetch the associated User record to get the username
            const user = await prisma.user.findUnique({
                where: { id: userCheck.id },
                select: { username: true }
            });
            // Check if user exists and create LoginAttempt record
            if (user) {
                await prisma.loginAttempt.create({
                    data: {
                        user: { connect: { id: userCheck.id } },
                        // userId: userCheck.id, // Not necessary since user is already connected
                        username: user.username,
                        ipAddress: ipAddress,
                        // Other fields...
                    },
                });
            }
            return res.status(401).json({ message: 'Invalid password or email' });
        }
        // Clear login attempts for the user upon successful login
        await prisma.loginAttempt.deleteMany({
            where: { userId: userCheck.id },
        });
        let user;
        // Find the user by email
        if (email.includes('@')) {
            // Find the user by email
            user = await prisma.users.findFirst({
                where: {
                    email: email,
                },
            });
        }
        else {
            // Find the user by username
            user = await prisma.users.findFirst({
                where: {
                    username: email,
                },
            });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid password or email' });
        }
        // Compare the provided password with the stored hash and salt
        const passwordMatch = await bcrypt.compare(password, user.password);
        // After generating the access token
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password or email' });
        }
        if (!req.session) {
            // If the session doesn't exist, create a new one
            const sessionMiddleware = configureSession();
            sessionMiddleware(req, res, () => { }); // Calling the session middleware with a dummy next function
            req.session = {};
        }
        req.session.isLoggedIn = true;
        req.session.email = email;
        req.session.userId = userCheck.id;
        const sessionID = req.sessionID;
        const sessionData = req.session;
        // For example, setting TTL to 3600 seconds (1 hour)
        const sessionLifetime = 45000; // 1 week in seconds
        await redis.set(`sess:${sessionID}`, JSON.stringify(sessionData), 'EX', sessionLifetime);
        const refreshToken = await jwt.sign({ id: user.id }, process.env.REFRESH_KEY, { expiresIn: '16h' });
        const token = await jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '30m' });
        const refreshTokenExpiration = 60 * 60 * 16; // 16 hours in seconds
        const refreshTokenKey = `refresh_token:${user.id}:${refreshToken}`;
        // Store the refresh token in Redis
        await redis.setex(refreshTokenKey, refreshTokenExpiration, '1');
        const LoginJWTTokenHttpOnlycookieExpiration = new Date(Date.now() + 29 * 60 * 1000); // 29 minutes in milliseconds
        res.cookie('LoginJWTTokenHttpOnly', token, {
            expires: LoginJWTTokenHttpOnlycookieExpiration,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.cookie('RefreshJWTTokenHttpOnly', refreshToken, {
            expires: new Date(Date.now() + 16 * 60 * 60 * 999),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        // Remove token from response object
        res.json({
            username: user.username,
            email: user.email,
            // refreshToken: refreshToken,  // Include refresh token for refresh logic
            id: user.id,
            registrationTokens: user.registrationTokens
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
    finally {
        await prisma.$disconnect(); // Disconnect Prisma client after the request is handled
    }
};
//# sourceMappingURL=loginUser.js.map