const mongoose = require("mongoose");
const ResultSchema = require("./result_schema");

module.exports = mongoose.model("Result", ResultSchema);
