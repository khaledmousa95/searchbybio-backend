import { Resend } from 'resend';
import { config } from 'dotenv';
config();
const resend = new Resend(process.env.RESEND_API_KEY);
export const emailUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        console.log("email from route:", email, "username from username", username);
        await resend.emails.send({
            from: "hello@email.searchbybio.com",
            to: email,
            subject: 'Welcome to searchbybio',
            html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    background-color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                }
        
                .container {
                    margin: 0 auto;
                    padding: 20px 0 48px;
                }
        
                .text {
                    font-size: 16px;
                    line-height: 26px;
                }
        
                .center {
                    text-align: center;
                }
        
                .button {
                    background-color: #8898aa;
                    border-radius: 3px;
                    color: #fff;
                    font-size: 16px;
                    text-decoration: none;
                    text-align: center;
                    display: inline-block;
                    padding: 12px;
                }
        
                .hr {
                    border-color: #cccccc;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <p class="text">
                    Hi ${username},
                </p>
                <p class="text">
                    Welcome to searchbybio, the networking intelligence platform that helps you find similar people and close connect faster.
                </p>
                <div class="center">
                    <a href="https://searchbybio.com" class="button">Get started</a>
                </div>
                <p class="text">
                    Best,<br />
                    The searchByBio team
                </p>
                <hr class="hr">
            </div>
        </body>
        </html>
        
        `
        });
        res.json({
            Status: 'ok'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//# sourceMappingURL=emailUser.js.map