const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ResultSchema = new Schema(
  {
    experience: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Experience",
    },
    error: { // TOTO
      type: Number,
      required: false
    },
    reactTime: {
      type: Number,
      required: false,
    },
    execTime: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = ResultSchema;
