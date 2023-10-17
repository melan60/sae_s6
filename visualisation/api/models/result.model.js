const mongoose = require("mongoose");
const ResultSchema = require("./result.schema");

module.exports = mongoose.model("Result", ResultSchema);
