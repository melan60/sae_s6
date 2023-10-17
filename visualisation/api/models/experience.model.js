const mongoose = require("mongoose");
const ExperienceSchema = require("./experience.schema");

module.exports = mongoose.model("Experience", ExperienceSchema);
