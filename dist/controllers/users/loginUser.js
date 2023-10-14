import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
const prisma = new PrismaClient();
dotenv.config();
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }
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
            return res.status(401).json({ message: 'User not found' });
        }
        // Compare the provided password with the stored hash and salt
        const passwordMatch = await bcrypt.compare(password, user.password);
        // After generating the access token
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const refreshToken = await jwt.sign({ id: user.id }, process.env.REFRESH_KEY, { expiresIn: '28d' });
        const token = await jwt.sign({ id: user.id, }, process.env.JWT_KEY, { expiresIn: "1d", });
        res.cookie('LoginJWTTokenHttpOnly', token, {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' // Set to true in production
        });
        res.json({
            username: user.username,
            email: user.email,
            token: token,
            refreshToken: refreshToken,
            id: user.id,
            registrationTokens: user.registrationTokens
        });
        // Assuming you already have the 'user' object after successful login
        const userExists = await prisma.users.findFirst({
            where: {
                id: user.id,
            },
        });
        if (userExists) {
            // Generate a new refresh token
            // Update the user with the new refresh token
            await prisma.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    refreshToken: refreshToken,
                },
            });
            // Now 'user' has been updated with a new refreshToken in the database
        }
        else {
            return res.status(401).json({ message: 'Error please logout and login again!' });
        }
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