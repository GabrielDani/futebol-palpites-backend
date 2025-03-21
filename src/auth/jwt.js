import jwt from "jsonwebtoken";

const SECRET =
  process.env.JWT_SECRET ||
  "56f328c1a2e0f72e64caef26ff416b520168d27b486b6d91e2438524dc37e97f588024613720be58c4e14dfd70f4358a761aa56201b3d06e5d5a11590dc49792";

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
}

export function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
