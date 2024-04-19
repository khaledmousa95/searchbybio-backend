import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
export const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies['RefreshJWTTokenHttpOnly'];
        if (refreshToken) {
            // Verify the refresh token and extract user ID
            const sessionUserId = req.session.userId;
            // Delete all existing refresh tokens associated with the user
            const refreshTokenPattern = `refresh_token:${sessionUserId}:*`;
            const refreshTokenKeys = await redis.keys(refreshTokenPattern);
            if (refreshTokenKeys.length > 0) {
                await redis.del(refreshTokenKeys);
            }
            // Generate a new refresh token
            const newRefreshToken = jwt.sign({ id: sessionUserId }, process.env.REFRESH_KEY, { expiresIn: '10s' });
            const refreshTokenKey = `refresh_token:${sessionUserId}:${newRefreshToken}`;
            const refreshTokenExpiration = 10; // 10 seconds
            // Store the new refresh token in Redis
            await redis.setex(refreshTokenKey, refreshTokenExpiration, '1');
            // Set the new short-lived refresh token in the cookie
            res.cookie('RefreshJWTTokenHttpOnly', newRefreshToken, {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production
            });
        }
        // removing the session at logout
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error logging out please clear your history from this site to logout');
            }
            res.clearCookie('LoginJWTTokenHttpOnly');
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        });
        // Clear the access token cookie
        // Perform any other logout actions here, such as clearing the user's session or token
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            const sessionUserId2 = req.session.userId;
            const refreshTokenPattern = `refresh_token:${sessionUserId2}:*`;
            const refreshTokenKeys = await redis.keys(refreshTokenPattern);
            await redis.del(refreshTokenKeys);
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error logging out please clear your history from this site to logout');
                }
                res.clearCookie('LoginJWTTokenHttpOnly');
                res.clearCookie('RefreshJWTTokenHttpOnly');
                res.clearCookie('connect.sid');
                res.status(200).json({ message: 'Logged out successfully' });
            });
            // Clear the access token cookie
            res.status(200).json({ message: 'Session timed out. Please login again.' });
            return;
        }
        else {
            console.error('Logout error:', error);
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error logging out please clear your history from this site to logout');
                }
                res.clearCookie('LoginJWTTokenHttpOnly');
                res.clearCookie('RefreshJWTTokenHttpOnly');
                res.clearCookie('connect.sid');
                res.status(200).json({ message: 'Logged out successfully' });
            });
            // Clear the access token cookie
            res.status(200).json({ message: 'Logged out successfully ' });
        }
    }
};
//# sourceMappingURL=logoutUserController.js.map