const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ModuleSchema = new Schema(
  {
    name: { type: String, required: true }, // the name of the module, like module 1
    key: { type: String, required: true }, // a unique identifier for the module
    uc: { type: String, required: true }, // the type of µC within
    description: { type: String, required: true }, // a description of the module
  },
  { versionKey: false }
);

module.exports = ModuleSchema;
