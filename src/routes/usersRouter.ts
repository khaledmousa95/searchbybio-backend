import express from 'express';
import { deleteUser } from '../controllers/users/deleteUser.js';
import { loginUser } from '../controllers/users/loginUser.js';
import { logoutUser } from '../controllers/users/logoutUserController.js';
import { updateTokens } from '../controllers/users/updateTokens.js';
import { createUser } from '../controllers/users/registerUserController.js';
import { authenticateJWT } from '../middleware/Auth.js';
import { verifyEmail } from '../controllers/email/emailVerification.js';
import { forgotPassword } from '../controllers/users/forgorPasswordController.js';

import { testAuth } from '../controllers/users/test.js';
import { resetPasswordController } from '../controllers/users/resetPasswordController.js';

const router = express.Router();

// Define user routes
router.delete('/:id', authenticateJWT, deleteUser);
router.post('/login', loginUser);
router.post('/register', createUser); // New route for user registration with email verification
router.get('/logout', logoutUser);
router.put('/update/:id', authenticateJWT, updateTokens);
router.get('/forgotpassword', forgotPassword)
router.post('/resetpassword', resetPasswordController)
router.get('/verify', verifyEmail)

router.get('/testauth',authenticateJWT,testAuth)

export default router;
