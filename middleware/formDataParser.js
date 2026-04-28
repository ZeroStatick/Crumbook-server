/**
 * Middleware to parse stringified JSON and numbers from FormData.
 * This is necessary because Multer/FormData sends everything as strings.
 */
const parseRecipeData = (req, res, next) => {
  try {
    // Parse Arrays/Objects
    const jsonFields = ["ingredients", "instructions", "tags"];
    jsonFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // If it fails, leave it as is; the validator will catch it
        }
      }
    });

    // Parse Numbers
    const numberFields = ["prepTime", "cookTime", "servings"];
    numberFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        const num = Number(req.body[field]);
        if (!isNaN(num)) {
          req.body[field] = num;
        }
      }
    });

    // Parse Booleans
    if (req.body.public === "true") req.body.public = true;
    if (req.body.public === "false") req.body.public = false;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { parseRecipeData };
