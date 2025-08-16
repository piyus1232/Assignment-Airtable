import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import session from "express-session";

dotenv.config();
connectDB();

const app = express();
app.use(
  session({
    secret: "super_secret_key", // change in production
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // true if https
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, // allow cookies
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
console.log("✅ Mounting /api/forms routes...");
app.use("/api/forms", formRoutes);

export default app;
