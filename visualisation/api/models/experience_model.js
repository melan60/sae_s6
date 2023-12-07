const mongoose = require("mongoose");
const ExperienceSchema = require("./experience_schema");

module.exports = mongoose.model("Experience", ExperienceSchema);
