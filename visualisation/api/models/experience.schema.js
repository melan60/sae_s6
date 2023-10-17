const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Config = require("../config");

let ExperienceSchema = new Schema(
  {
    id_exp: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      minLength: Config.NAME_MIN_SIZE,
      maxLength: Config.NAME_MAX_SIZE,
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
