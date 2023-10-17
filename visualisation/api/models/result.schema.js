const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ResultSchema = new Schema(
  {
    experience: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Experience",
    },
    reactTime: {
      type: Date("HH:mm:ss"), // TODO
      required: false,
    },
    execTime: {
      type: Date("HH:mm:ss"),
      required: true,
    },
    date: {
      type: Date("YYYY-MM-DD"),
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = ResultSchema;
