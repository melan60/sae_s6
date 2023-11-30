const mongoose = require("mongoose");
const ModuleSchema = require("./module_schema");

module.exports = mongoose.model("Module", ModuleSchema);
