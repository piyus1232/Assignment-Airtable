import User from "../models/User.js";

// protect.js
export const protect = async (req, res, next) => {
  console.log("🧩 Incoming x-user-id:", req.headers["x-user-id"]);
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Not authorized" });

    const user = await User.findById(userId);
    console.log("🔎 Fetched user:", user);

    if (!user) return res.status(401).json({ error: "Invalid user" });

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ protect error:", error);
    res.status(401).json({ error: "Not authorized" });
  }
};

