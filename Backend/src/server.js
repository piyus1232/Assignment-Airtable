import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
<<<<<<< HEAD
);
=======
);
>>>>>>> 170afc4 (Added connect-mongo and updated server.js for MongoStore)
