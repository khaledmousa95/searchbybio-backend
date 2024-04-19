import express from 'express';
import { adminDelete } from '../../controllers/users/adminDelete.js';


const router = express.Router();


export const adminDeleteUser = router.delete('/:id', adminDelete

);



