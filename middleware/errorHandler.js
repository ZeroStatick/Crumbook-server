/**
 * Central error handler. Sends consistent JSON: { success: false, message }.
 */
const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "ZodError") {
    status = 400;
    message = err.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid input for field ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    status = 409;
    message = `An account with that ${Object.keys(err.keyValue)[0]} already exists.`;
  }

  res.status(status).json({ success: false, message });
};

module.exports = { errorHandler };
