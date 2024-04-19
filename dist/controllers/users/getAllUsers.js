import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await prisma.users.findMany();
        // Get total count of users
        const totalCount = await prisma.users.count();
        // Set X-Total-Count header
        await res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        await res.header('X-Total-Count', totalCount);
        // Send the list of users as JSON response
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
    finally {
        await prisma.$disconnect(); // Disconnect Prisma client after the request is handled
    }
};
//# sourceMappingURL=getAllUsers.js.map