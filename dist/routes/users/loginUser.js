import express from 'express';
import { loginUser } from '../../controllers/users/loginUser.js';
const router = express.Router();
export const userLogin = router.post('/', loginUser);
//# sourceMappingURL=loginUser.js.map