import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const updateTokens = async (req, res) => {
    try {
        const userId = Number(req.params.id); // Convert to number if necessary
        // Assuming id is provided in the URL params
        const registrationTokens = await req.body.registrationTokens;
        if (!userId || !registrationTokens) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Find the user by their ID
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the registrationTokens
        const updatedUser = await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                registrationTokens,
            },
        });
        res.status(200).json({ message: 'Registration tokens updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
    finally {
        await prisma.$disconnect();
    }
};
//# sourceMappingURL=updateTokens.js.map