import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { username, password, email,registrationTokens } = req.body;

    if (!username || !password || !email) {
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

    // Create the user with the hashed password
    const createdUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword, // Store the hashed password
        email,
        registrationTokens,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: 'User created successfully', user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request is handled
  }
};
