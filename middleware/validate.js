const { z } = require("zod");

/**
 * Middleware to validate request data using Zod schemas.
 * It checks body, query, and params against the provided schema.
 */
const validate = (schema) => (req, res, next) => {
  try {
    console.log("Validating Request Body:", req.body);
    // .parse() returns the transformed data
    const parsedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Reassign cleaned data to req to preserve transformations (trim, defaults, etc.)
    req.body = parsedData.body;
    req.query = parsedData.query;
    req.params = parsedData.params;

    next();
  } catch (error) {
    // If it's a Zod error, it will be caught by our errorHandler
    next(error);
  }
};

module.exports = validate;
