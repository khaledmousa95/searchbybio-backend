import express from 'express';
import { emailUser } from '../../controllers/users/emailUser.js';
const router = express.Router();
router.use(express.json()); // Parse JSON
export const userEmail = router.post('/', emailUser);
//# sourceMappingURL=emailUser.js.map