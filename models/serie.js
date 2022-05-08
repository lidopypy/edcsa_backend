const mongoose = require("mongoose");

//define a schema
const serieSchema = new mongoose.Schema({
  serie: {
    type: String,
    required: true,
    // minlength: [22, "input length not correct!!"],
    // maxlength: [22, "input length not correct!!"],
  },
});

//create a model for students
const Serie = mongoose.model("Serie", serieSchema);

module.exports = Serie;
