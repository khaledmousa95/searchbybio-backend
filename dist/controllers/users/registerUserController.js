import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import validator from 'validator';
import nodemailer from 'nodemailer';
import { generateRandomSixDigitNumber } from '../../utils/verifyNumber.js';
const prisma = new PrismaClient();
export const createUser = async (req, res) => {
    try {
        const { username, password, email, registrationTokens } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please register a using proper email' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please use a proper email' });
        }
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (!username || !password || !email || username.trim() === '' || password.trim() === '') {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Check if the username or email already exists
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    {
                        username,
                    },
                    {
                        email,
                    },
                ],
            },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        const saltRounds = 10; // The number of salt rounds determines the computational cost
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt); // 10 is the salt rounds
        const emailVerificationToken = generateRandomSixDigitNumber();
        const hashedEmailVerificationToken = await bcrypt.hash(emailVerificationToken.toString(), salt);
        // Create the user with the hashed password
        const createdUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                email,
                registrationTokens,
                emailVerificationToken: hashedEmailVerificationToken,
                createdAt: new Date(),
            },
        });
        const createdUserForlog = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
            },
        });
        // Function to send verification email
        async function main() {
            const transporter = nodemailer.createTransport({
                host: 'smtp.resend.com',
                secure: true,
                port: 465,
                auth: {
                    user: 'resend',
                    pass: process.env.RESEND_API_KEY,
                },
            });
            const verifcationEndpoint = process.env.NODE_ENV === "production" ? process.env.PROD_SERVER : "http://localhost:8080";
            const verificationLink = `${verifcationEndpoint}/api/users/verify?email=${createdUser.email}&token=${emailVerificationToken}`;
            const info = await transporter.sendMail({
                from: process.env.VERIFY_EMAIL,
                to: createdUser.email,
                subject: 'Email Verification',
                html: `<strong>  Please click the following link to verify your email: ${verificationLink}</strong>`
            });
        }
        main().catch(console.error);
        // destructing the createdUser to send it as a respone to the frotnend without the hashed password
        const { password: any, ...allDataWithoutPassword } = createdUser;
        res.status(201).json({ message: 'User created successfully', user: allDataWithoutPassword });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
    finally {
        await prisma.$disconnect(); // Disconnect Prisma client after the request is handled
    }
};
//# sourceMappingURL=registerUserController.js.map