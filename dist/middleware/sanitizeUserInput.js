import sanitizeHtml from 'sanitize-html';
const sanitizeUserInput = (req, res, next) => {
    // Sanitize request body
    if (req.body) {
        req.body = sanitizeHtml(req.body, {
            allowedTags: [],
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
//# sourceMappingURL=sanitizeUserInput.js.map