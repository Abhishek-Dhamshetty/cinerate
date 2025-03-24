const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    imdbRating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    cbfc: {
      type: String,
      enum: ["U", "U/A", "A"],
      required: true,
    },
    userRatings: {
      type: [Number], // Array of ratings
      default: [],
    },
    genre: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
      required: true,
    },
    bookMyShowLink: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("movie", movieSchema);
module.exports = Movie;