import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
const validateInputs = (email, code) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    // Validate code format
    if (code.length !== 20 || !/^[0-9a-fA-F]+$/.test(code)) {
        throw new Error('Invalid code format');
    }
};
const checkEmailExists = async (email) => {
    const user = await prisma.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('User not found');
    }
};
const compareCodeWithEmail = async (email, code) => {
    const key = `passwordResetToken:${code}`;
    const storedEmail = await redis.get(key);
    if (storedEmail !== email) {
        throw new Error('Invalid or expired code');
    }
};
export async function resetPasswordController(req, res) {
    const { email, code, newPassword } = req.body;
    try {
        // Validate inputs
        validateInputs(email, code);
        // Check if the email exists in Prisma
        await checkEmailExists(email);
        // Compare code with the email in Redis
        await compareCodeWithEmail(email, code);
        // Hash the new password
        const saltRounds = 10; // The number of salt rounds determines the computational cost
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt); // 10 is the salt rounds
        // Update the user's password in the database
        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        });
        // If all checks pass, return success
        res.status(200).send('Password reset successful');
    }
    catch (error) {
        res.status(400).send(error);
    }
}
;
//# sourceMappingURL=resetPasswordController.js.map