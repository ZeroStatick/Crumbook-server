const { z } = require("zod");

/**
 * Middleware to validate request data using Zod schemas.
 * It checks body, query, and params against the provided schema.
 */
const validate = (schema) => (req, res, next) => {
  try {
    // .parse() will throw an error if validation fails
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // If it's a Zod error, it will be caught by our errorHandler
    next(error);
  }
};

module.exports = validate;
