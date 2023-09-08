import express from 'express';
import { logoutUser } from '../../controllers/users/logoutUserController.js';
const router = express.Router();


export const userLogout = router.get('/', logoutUser

);