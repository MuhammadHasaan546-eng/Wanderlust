require("dotenv").config();
const express = require("express");
const engine = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const routerListing = require("./routes/listings.js");
const routerReview = require("./routes/reviews.js");
const routerUser = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

// Environment variables
const MONGODB_URL = process.env.MONGO_DB_URL;
const SECRET = process.env.SECRET || "keyboard cat";

// ----- Mongoose Connect -----
main()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // enforce TLS
    tlsAllowInvalidCertificates: false, // safe for production
  });
}

// ----- EJS -----
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----- Middleware -----
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ----- Session Store -----
const store = MongoStore.create({
  mongoUrl: MONGODB_URL,
  crypto: { secret: SECRET },
  touchAfter: 24 * 60 * 60,
});
store.on("error", (e) => console.log("SESSION STORE ERROR", e));

app.use(
  session({
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----- Flash & Current User Middleware -----
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ----- Routes -----
app.use("/", routerUser);
app.use("/listings", routerListing);
app.use("/listings/:id/reviews", routerReview);

// ----- 404 & Error Handling -----
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// ----- Server -----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
