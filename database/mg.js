require("dotenv").config();
const mongoose = require("mongoose");

// TODO: Set up a connection to the "expresso" MongoDB database
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`); // Fix this string

const reviewsSchema = new mongoose.Schema({
  product_id: {type: Number, required: true},
  review_id: {type: Number, required: true},
  rating: Number,
  body: String,
  summary: String,
  recommend: Boolean,
  response: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: [{
    photo_id: {type: Number, required: true, unique: true},
    url: String
  }],
  characteristics: {
    characteristic_id: {type: Number, required: true},
    characteristic: String,
    value: String
  },
  ratings: {
    "1": Number,
    "2": Number,
    "3": Number,
    "4": Number,
    "5": Number
  }
  recommended: {
    "yes": Number,
    "no": Number
  }
});
