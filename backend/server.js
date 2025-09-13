import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";  // Router style
import { requireAuth } from "./middleware/requireAuth.js";



dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);  

// example protected endpoint
app.get("/api/account", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.email}`, user: req.user });
});

const start = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API on http://localhost:${port}`));
};
start();
