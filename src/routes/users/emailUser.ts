

import express from 'express';
import { emailUser } from '../../controllers/users/emailUser.js';
const router = express.Router();

export const userEmail = router.post('/',emailUser 

);
