import jwt from "jsonwebtoken"

import * as dotenv from 'dotenv';


dotenv.config();

// Custom middleware for JWT authentication
export function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');
  console.log(token, "token from Auth middleware")
  if (!token) {
    console.log("!token", "im here")

     res.status(401).json({ message: 'Unauthorized' })
     return
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      console.log("err after verify")
       res.status(403).json({ message: 'Please register an account to complete this' })
       return;
    }
    console.log("great success")

    req.user = user;
    next();
  });
}




