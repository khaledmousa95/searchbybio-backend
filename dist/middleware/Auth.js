import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();
export function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
    const refreshToken = req.header('RefreshToken');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Access token has expired, attempt to refresh it
                if (refreshToken) {
                    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, decoded) => {
                        if (err) {
                            return res.status(403).json({ message: 'Invalid refresh token' });
                        }
                        // Generate a new access token
                        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_KEY, { expiresIn: '1d' });
                        // Attach the new access token to the request object for further use
                        req.accessToken = newAccessToken;
                        next();
                    });
                }
                else {
                    return res.status(403).json({ message: 'Something went wrong please try to logout and login or clear cookies' });
                }
            }
            else {
                return res.status(403).json({ message: 'Please register an account to complete this' });
            }
        }
        else {
            req.user = user;
            next();
        }
    });
}
//# sourceMappingURL=Auth.js.map