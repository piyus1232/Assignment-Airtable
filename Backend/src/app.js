import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
connectDB();

const app = express();
console.log("SESSION_SECRET exists?", !!process.env.SESSION_SECRET);
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // sessions last 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true, // allow cookies
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
console.log("✅ Mounting /api/forms routes...");
app.use("/api/forms", formRoutes);

export default app;
