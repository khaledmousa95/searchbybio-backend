import Redis from 'ioredis';
import * as crypto from 'crypto';
import { sendPasswordResetEmail } from '../email/sendPasswordResetEmail.js'; // Assuming you have an email utility function
import { PrismaClient } from '@prisma/client';

// Create a Redis client instance
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
const prisma = new PrismaClient();

export async function forgotPassword(req, res) {
  try {
    // Extract email from the request
    const {email} = req.query;

    // Check if the email exists in the database
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Generate unique token
    const token = crypto.randomBytes(10).toString('hex');

    // Set token in Redis with expiration time
    const key = `passwordResetToken:${token}`;
    await redis.set(key, email, 'EX', 1200); // Expires in 1 hour (3600 seconds)

    // Send email with reset link
    await sendPasswordResetEmail(email, token);

    return res.status(200).send('Reset link sent to your Email.');

  } catch (error) {
    return res.status(500).send('Error setting passowrd.');

  }
};
