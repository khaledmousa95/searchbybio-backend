import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

const sanitizeUserInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeHtml(req.body, {
      allowedTags: [], // Specify allowed HTML tags
      allowedAttributes: {}, // Specify allowed HTML attributes
      // Add more options as needed
    });
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeHtml(req.query, {
      allowedTags: [],
      allowedAttributes: {},
      // Add more options as needed
    });
  }

  // Sanitize other user input as needed
  // ...

  next();
};

export default sanitizeUserInput;