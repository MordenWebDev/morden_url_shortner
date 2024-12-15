import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

const authMiddleware = (req, res, next) => {
  console.log(req.header, "hearder");
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
