import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token)
    return res.status(401).json({ message: "No token. Unauthorized." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/Expired token." });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
