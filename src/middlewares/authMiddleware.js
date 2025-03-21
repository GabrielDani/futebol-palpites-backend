import { verifyToken } from "../auth/jwt.js";
import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../utils/customErrors.js";

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new UnauthorizedError("Token inválido"));

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new UnauthorizedError("Token expirado. Faça o login novamente.")
      );
    }
    return next(new UnauthorizedError("Token inválido."));
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return next(new ForbiddenError("Acesso proibido."));
  }
  next();
}
