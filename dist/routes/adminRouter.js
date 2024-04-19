import express from 'express';
import { authenticateJWT } from '../middleware/Auth.js';
import { adminDelete } from '../controllers/users/adminDelete.js';
import { getAllUsers } from '../controllers/users/getAllUsers.js';
const router = express.Router();
// admin routes
router.delete('/getallusers/:id', authenticateJWT, adminDelete);
router.get('/getallusers', authenticateJWT, getAllUsers);
export default router;
//# sourceMappingURL=adminRouter.js.map