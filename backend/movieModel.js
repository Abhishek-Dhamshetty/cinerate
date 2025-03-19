const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    trailerUrl: { type: String, required: true },
    imdbRating: { type: Number, default: 0, min: 0, max: 10 },
    cbfc: { type: String, required: true },
    userRatings: [{ type: Number, min: 0, max: 5 }], // Ensures valid ratings
    genre: { type: String, required: true }, // Supports multiple genres
    youtubeLink: { type: String, required: true },
    bookMyShowLink: { type: String, required: true },
    thumbnail: { type: String, required: true },
    industry:{type: String, required: true}
});

const Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;
