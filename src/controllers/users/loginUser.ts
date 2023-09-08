import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();
dotenv.config();

export const loginUser = async (req, res) => {
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    // Find the user by email
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Compare the provided password with the stored hash and salt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) { return res.status(401).json({ message: 'Invalid password' }); }
    
    const token = jwt.sign({ id: user.id, }, process.env.JWT_KEY, {expiresIn:"365d"});
    res.json({id: user.username, email: user.email, token :token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request is handled
  }
};
