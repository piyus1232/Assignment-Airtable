import app from "./app.js";

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
=======
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
);
>>>>>>> 7f51cd34f1760c6d796837cc15f626469cb8a9dc
