const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authorization header",
    });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded._id, role: decoded.role };
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.ownerAuth = (req, res, next) => {
  if (req.user?.role !== 3) {
    return res
      .status(403)
      .json({ success: false, message: "Owner access required" });
  }
  next();
};

exports.moderatorAuth = (req, res, next) => {
  if (req.user?.role !== 2) {
    return res
      .status(403)
      .json({ success: false, message: "Moderator access required" });
  }
  next();
};

exports.ownerAndUserAuth = (req, res, next) => {
  if (req.user?.role !== 3 && req.user?._id !== req.params.id) {
    return res
      .status(403)
      .json({ success: false, message: "Owner or user access required" });
  }
  next();
};

exports.moderatorAndOwnerAuth = (req, res, next) => {
  if (req.user?.role !== 2 && req.user?.role !== 3) {
    return res
      .status(403)
      .json({ success: false, message: "Moderator or owner access required" });
  }
  next();
};
