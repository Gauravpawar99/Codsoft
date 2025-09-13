// backend/utils/tokens.js
import jwt from "jsonwebtoken";

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id, email: user.email, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  );

export const signRefreshToken = (user) =>
  jwt.sign(
    { sub: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
  );

export const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,              // set true in production (HTTPS)
    path: "/api/auth/refresh",  // must match clearCookie path in /logout
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
