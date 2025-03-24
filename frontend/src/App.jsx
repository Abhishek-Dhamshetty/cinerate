import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from './components/MovieCard';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Function to fetch movies based on selected industry
  const fetchMovies = async () => {
    try {
      const params = selectedIndustry !== "All" ? { industry: selectedIndustry } : {};
      const response = await axios.get("http://localhost:9000/movie-api/all-movies", { params });

      console.log("API Response:", response.data); // Debugging log

      // Handle different API response formats
      if (response.data?.movies && Array.isArray(response.data.movies)) {
        setMovies(response.data.movies);
      } else {
        console.error("Unexpected API response format:", response.data);
        setMovies([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]); // Fallback to empty array
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies when industry changes
  }, [selectedIndustry]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-yellow-400 animate-pulse drop-shadow-lg">
        CineRate
      </h1>
      <h2 className="text-3xl font-bold text-center mb-6">
        Latest Movie Reviews
      </h2>

      {/* Industry Filter Dropdown */}
      <div className="flex justify-center mb-10">
        <select
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
        >
          <option value="All">All Industries</option>
          <option value="Tollywood">Tollywood</option>
          <option value="Bollywood">Bollywood</option>
          <option value="Hollywood">Hollywood</option>
        </select>
      </div>

      {/* Display Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-center">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              style={{ width: "300px", minHeight: "420px" }}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No movies found for the selected industry.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;