const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { userSignupSchema } = require("../schema.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signup,
  renderSignupForm,
  login,
  logout,
  renderLoginForm,
} = require("../controllers/user.js");
const { render } = require("ejs");

const userVladateSchema = (req, res, next) => {
  const { error } = userSignupSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    res.redirect("/signup");
  } else {
    next();
  }
};
router
  .route("/signup")
  .get(renderSignupForm)
  .post(userVladateSchema, wrapAsync(signup));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login,
  );
router;

router;
router.get("/logout", logout);

module.exports = router;
