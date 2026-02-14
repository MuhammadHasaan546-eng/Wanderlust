const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image.url = url;
  newListing.image.filename = filename;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.renderEditFrom = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not exists yet !");
    return res.redirect("/listings");
  }
  let orginImage = listing.image.url;
  orginImage = orginImage.replace("/upload", "/upload/h_300,w_250");
  res.render("edit.ejs", { listing, orginImage });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true },
  );
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image.url = url;
    listing.image.filename = filename;
    await listing.save();
  }

  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Listing");

  res.redirect("/listings");
};
