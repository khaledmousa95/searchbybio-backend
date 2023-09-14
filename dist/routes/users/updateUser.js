import express from 'express';
import { updateTokens } from '../../controllers/users/updateTokens.js';
const router = express.Router();
export const tokenUpdate = router.put('/:id/registrationTokens', updateTokens);
//# sourceMappingURL=updateUser.js.map