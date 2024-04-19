import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
export async function authenticateJWT(req, res, next) {
    try {
        const session = req.session;
        const sessionEmail = req.session.email;
        const sessionID = req.sessionID;
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized: Session expired or not logged in ' });
        }
        // Check if the session ID and email provided by the user match the data in Redis
        const sessionDataInRedis = await redis.get(`sess:${sessionID}`);
        if (!sessionDataInRedis) {
            return res.status(403).json({ message: 'Unauthorized: Session expired or not logged in' });
        }
        const parsedSessionData = JSON.parse(sessionDataInRedis);
        // checking to see if the email trying auth using the session match the one in redis
        if (typeof parsedSessionData.email !== 'string' || typeof sessionEmail !== 'string' || parsedSessionData.email !== sessionEmail) {
            return res.status(403).json({ message: 'Unauthorized: Session expired or not logged in' });
        }
        const accessToken = req.cookies['LoginJWTTokenHttpOnly'];
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: You are not logged in. Please login.' });
        }
        // Decode the access token
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_KEY);
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                // If token is expired, attempt to refresh it
                const refreshToken = req.cookies['RefreshJWTTokenHttpOnly'];
                if (!refreshToken) {
                    return res.status(403).json({ message: 'Unauthorized: Session timed out. Please login again.' });
                }
                try {
                    // Verify the refresh token and extract user ID
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
                    const refreshTokenKey = `refresh_token:${decodedRefreshToken.id}:${refreshToken}`;
                    // Check if the refresh token exists in Redis
                    const refreshTokenExists = await redis.exists(refreshTokenKey);
                    // Refresh token is invalid
                    if (!refreshTokenExists) {
                        return res.status(403).json({ message: 'Unauthorized: Session timed out. Please login again.' });
                    }
                    // Generate a new access token
                    const newAccessToken = jwt.sign({ id: decodedRefreshToken.id }, process.env.JWT_KEY, { expiresIn: '30m' });
                    const cookieExpiration = new Date(Date.now() + 29 * 60 * 1000); // 29 minutes in milliseconds
                    res.cookie('LoginJWTTokenHttpOnly', newAccessToken, {
                        expires: cookieExpiration,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    });
                    req.accessToken = newAccessToken;
                    next();
                }
                catch (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(403).json({ message: ' Unauthorized:Session timed out. Please delete history and login again.' });
                    }
                    else {
                        return res.status(403).json({ message: 'Invalid refresh token.' });
                    }
                }
            }
            else {
                // Invalid access token
                return res.status(403).json({ message: 'Unauthorized: Session timed out. Please login again.' });
            }
        }
    }
    catch (err) {
        console.error('Error in authentication:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
//# sourceMappingURL=Auth.js.map