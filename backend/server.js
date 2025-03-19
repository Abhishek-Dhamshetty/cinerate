const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Change this when deploying
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Database Connection
mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.error("MongoDB Connection Error:", err));

const Movie = require('./movieModel');

// API Endpoints
app.get("/movies", async (req, res) => {
    try {
      const { industry } = req.query;
  
      // Query to fetch all movies or filter by industry if specified
      const query = industry && industry !== "All" ? { industry } : {};
  
      const movies = await Movie.find(query);
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.post('/rateMovie', async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (!Array.isArray(movie.userRatings)) {
      movie.userRatings = [];
    }

    movie.userRatings.push(rating);
    await movie.save();
    
    res.json({ success: true, message: "Rating added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to rate movie", details: err.message });
  }
});

app.post('/addMovie', async (req, res) => {
  try {
    console.log("Request received. Payload size:", JSON.stringify(req.body).length, "bytes");

    const newMovie = new Movie(req.body);
    await newMovie.save();
    
    res.status(201).json({ success: true, message: 'Movie added successfully!' });
  } catch (err) {
    res.status(500).json({ error: "Failed to add movie", details: err.message });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
