const mongoose = require("mongoose");
const UserSchema = require("./user_schema"); // Make sure the path is correct

// Create the model from the schema and export it.
const User = mongoose.model("User", UserSchema);

module.exports = User;
