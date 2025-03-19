import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../MovieCard";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Function to fetch movies based on selected industry
  const fetchMovies = async (industry) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies`, {
        params: { industry }, // Send industry as query parameter
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(selectedIndustry); // Fetch movies when industry changes
  }, [selectedIndustry]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-yellow-400 animate-pulse drop-shadow-lg">CineRate</h1>
      <h2 className="text-3xl font-bold text-center mb-6">Latest {selectedIndustry} Movies Reviews</h2>

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
            <MovieCard key={movie._id} movie={movie} style={{ width: "300px", minHeight: "420px" }} />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No movies found for the selected industry.</p>
        )}
      </div>
    </div>
  );
};

export default App;
