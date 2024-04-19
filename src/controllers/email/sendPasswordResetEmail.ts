import nodemailer from 'nodemailer'

export async function sendPasswordResetEmail(email, token) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  const tokenString = token;
  const info = await transporter.sendMail({
    from: process.env.VERIFY_EMAIL,
    to: email,
    subject: 'Reset Password',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          text-align: center; /* Center align the content */
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
          margin-top: 20px;
        }
        .reset-instructions {
          font-weight: bold;
          margin-top: 20px;
          
        }
        .reset-instructions2 {
          font-weight: bold;
          margin-top: 20px;
          color: #000;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Password</h1>
        <p class="reset-instructions">This is the reset password code that you have requested. The code is valid only for 20 minutes.</p>
        <p class="reset-instructions2">${tokenString}</p>
      </div>
    </body>
    </html>
    
    `
  });

  
}