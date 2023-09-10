import { PrismaClient } from '@prisma/client';
// import { cookie } from 'express-validator';
// import {cookie} from 'cookie-parser';
const prisma = new PrismaClient();
export const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Convert to number if necessary
    console.log(userId, "this is user id1");
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user || user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
        await prisma.users.delete({
            where: {
                id: userId,
            },
        });
        return res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
//# sourceMappingURL=deleteUser.js.map