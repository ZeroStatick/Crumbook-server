/**
 * Middleware to parse stringified JSON and numbers from FormData.
 * This is necessary because Multer/FormData sends everything as strings.
 */
const parseFields = (req, fields) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === "string" && req.body[field].trim() !== "") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        throw new Error(`Invalid JSON format for field: ${field}`);
      }
    }
  });
};

const parseJSONFields = (fields) => (req, res, next) => {
  try {
    parseFields(req, fields);
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const parseRecipeData = (req, res, next) => {
  try {
    // 1. Parse JSON fields first
    parseFields(req, ["ingredients", "instructions", "tags"]);

    // 2. Handle numeric fields
    const numberFields = ["prepTime", "cookTime", "servings"];
    numberFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        const val = Number(req.body[field]);
        if (!isNaN(val)) {
          req.body[field] = val;
        }
      }
    });

    // 3. Handle boolean fields
    if (req.body.public === "true") req.body.public = true;
    if (req.body.public === "false") req.body.public = false;

    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const parseGuideData = parseJSONFields(["ingredients", "tags"]);

module.exports = { parseRecipeData, parseGuideData };
