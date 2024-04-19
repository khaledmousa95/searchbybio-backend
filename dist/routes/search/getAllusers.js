import express from 'express';
import { getAllUsers } from '../../controllers/users/getAllUsers.js';
const router = express.Router();
export const getAllUsersRoute = router.get('/', getAllUsers);
export default router;
//# sourceMappingURL=getAllusers.js.map