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
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        console.log(user);
        const token = await jwt.sign({ id: user.id, }, process.env.JWT_KEY, { expiresIn: "365d" });
        res.json({ username: user.username, email: user.email, token: token, id: user.id, registrationTokens: user.registrationTokens });
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