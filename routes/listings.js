const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  updateListing,
  deleteListing,
  renderEditFrom,
} = require("../controllers/listings.js");
const { create } = require("../models/review.js");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing),
  );

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing),
  )
  .delete(isLoggedIn, wrapAsync(deleteListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditFrom));

module.exports = router;
