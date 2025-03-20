import { verifyToken } from "../auth/jwt.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(403)
        .json({ error: "Token expirado, faça login novamente. " });
    }
    return res.status(403).json({ error: "Token inválido." });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso proibido. " });
  }
  next();
}
