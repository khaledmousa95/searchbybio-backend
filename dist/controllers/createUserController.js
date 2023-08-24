// // making a search controller to handle the search requests using prisma client
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export const createUser = async (req, res) => {  
//     try {
//         const { search } = req.body;
//         if (!search || typeof search !== 'string'  ) {
//             return res.status(400).json({ message: "Invalid search input" });
//         }
//         const searchResults = await prisma.users.createMany({
//          data: [
//             {
//                 username: "test",
//                 password: "test",
//                 email: "0",
//                 createdAt: new Date(),
//         }]})
//         console.log(searchResults);
//         res.json(searchResults);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };
//# sourceMappingURL=createUserController.js.map