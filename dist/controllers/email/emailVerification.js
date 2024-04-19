// controllers/users/emailUser.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
// ... (import statements)
export async function verifyEmail(req, res) {
    const { email, token } = req.query;
    const emailVerificationToken = token;
    try {
        // Check if the email exists
        const existingUser = await prisma.users.findUnique({
            where: {
                email,
            },
        });
        if (!existingUser) {
            return res.status(404).send('User not found');
        }
        // Compare the provided verification token with the hashed token in the database
        const isValidToken = await bcrypt.compare(emailVerificationToken, existingUser.emailVerificationToken);
        if (!isValidToken) {
            return res.status(400).send('Invalid verification token');
        }
        // If the verification token is valid, update the user's verified status
        const updatedUser = await prisma.users.update({
            where: {
                email: existingUser.email,
            },
            data: {
                verified: true,
                emailVerificationToken: null, // Set the verification token to null after verification
            },
        });
        res.status(200).send('Email verified successfully');
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Internal server error');
    }
}
//# sourceMappingURL=emailVerification.js.map