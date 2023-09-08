import express from 'express';
import { createUser } from '../../controllers/users/registerUserController.js';
const router = express.Router();

export const userRegister = router.post('/',createUser 

);
