const express = require("express");
const Movie = require("../models/moviesModel");

const router = express.Router();

// ✅ Fetch movies based on industry filter
router.get("/all-movies", async (req, res) => {
  try {
    const { industry } = req.query; // Get industry from query params

    let filter = {}; // Default: fetch all movies
    if (industry && industry !== "All") {
      filter = { industry }; // Apply industry filter if not "All"
    }

    const movies = await Movie.find(filter);
    res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// ✅ Fetch a movie by ID
router.get("/movie/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// ✅ Update a movie by ID
router.put("/update-movie/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// ✅ Delete a movie by ID
router.delete("/delete-movie/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// ✅ Add a user rating to a movie & Update Average Rating
router.post("/rate-movie", async (req, res) => {
  try {
    const { title, rating } = req.body; // Using title instead of ID

    if (!title || !rating || rating < 0 || rating > 10) {
      return res.status(400).json({ success: false, message: "Title and valid rating (0-10) are required." });
    }

    const movie = await Movie.findOne({ title }); // Find movie by title
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Add rating to userRatings array
    movie.userRatings.push(rating);

    // Calculate the new average rating
    const totalRatings = movie.userRatings.length;
    const sumRatings = movie.userRatings.reduce((acc, curr) => acc + curr, 0);
    movie.imdbRating = (sumRatings / totalRatings).toFixed(1); // Updated IMDb rating

    await movie.save();

    res.status(200).json({ success: true, message: "Rating added successfully", movie });
  } catch (error) {
    console.error("Error rating movie:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

module.exports = router;