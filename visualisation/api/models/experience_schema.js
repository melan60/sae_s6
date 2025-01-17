const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Config = require("../common_variables");

let ExperienceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: Config.NAME_MIN_SIZE,
      maxLength: Config.NAME_MAX_SIZE,
    },
    numero: {
      type: Number,
      required: true,
    },
    typeStimulus: {
      type: String,
      required: true,
    },
    distraction: {
      type: String,
      required: false,
    },
    modules: [{ type: Schema.Types.ObjectId, required: false, ref: "Module" }],
  },
  { versionKey: false }
);

module.exports = ExperienceSchema;
