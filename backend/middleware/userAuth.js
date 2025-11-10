import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : req.headers?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    const name = error?.name || "Error";
    if (name === "JsonWebTokenError" || name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

export default userAuth;
