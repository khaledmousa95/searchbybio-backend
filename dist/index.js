// create a connection the rds mysql database
import express from 'express';
import * as dotenv from 'dotenv';
import { searchRouteGet, searchRoutePost } from './routes/searchDBRoute.js';
import { searchMorePost } from './routes/searchMore.js';
import * as cors from "cors";
import { userRegister } from './routes/users/registerUser.js';
import { userLogin } from './routes/users/loginUser.js';
import { userLogout } from './routes/users/logoutUser.js';
import { authenticateJWT } from './middleware/Auth.js';
import { userDelete } from './routes/users/deleteUser.js';
import cookieParser from "cookie-parser";
import { tokenUpdate } from './routes/users/updateUser.js';
// const prisma = new PrismaClient();
const app = express();
const port = 5000;
//open cors for all origins
app.use(cors.default());
dotenv.config();
//middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());
// search routes
app.use('/api/search', searchRouteGet, searchRoutePost);
app.use('/api/search/more', authenticateJWT, searchMorePost);
// user routes
app.use('/api/user/login', userLogin);
app.use('/api/user/register', userRegister);
app.use('/api/user/logout', userLogout);
app.use('/api/user/delete', authenticateJWT, userDelete);
app.use('/api/user/update', authenticateJWT, tokenUpdate);
// app.use(errorHandler)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map