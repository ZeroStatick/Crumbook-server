/**
 * Central error handler. Sends consistent JSON: { success: false, message }.
 */
const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode ?? 500;
  let message = err.message ?? "Internal server error";

  if (err.code === 11000) {
    status = 409;
    message = "Email already registered";
  }

  res.status(status).json({ success: false, message });
};

module.exports = { errorHandler };
