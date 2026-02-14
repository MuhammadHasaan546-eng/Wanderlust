const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userScheam = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userScheam.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userScheam);
