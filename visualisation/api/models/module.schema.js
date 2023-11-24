const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ModuleSchema = new Schema(
  {
    name: { type: String, required: true },
    uc: { type: String, required: true },
    description: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = ModuleSchema;
