import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();
// Custom middleware for JWT authentication
export function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Please register an account to complete this' });
            return;
        }
        req.user = user;
        next();
    });
}
//# sourceMappingURL=Auth.js.map