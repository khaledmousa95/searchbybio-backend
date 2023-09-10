import express from 'express';
import { deleteUser } from '../../controllers/users/deleteUser.js';
const router = express.Router();
export const userDelete = router.delete('/:id', deleteUser);
//# sourceMappingURL=deleteUser.js.map