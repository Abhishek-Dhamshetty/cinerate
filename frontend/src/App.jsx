import React, { useEffect, useState, useContext } from "react";
import { MovieContext } from "./MovieContext";
import MovieCard from "../MovieCard";

const App = () => {
  const { movies } = useContext(MovieContext);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    setFilteredMovies(
      selectedIndustry === "All"
        ? movies
        : movies.filter((movie) => movie.industry === selectedIndustry)
    );
  }, [selectedIndustry, movies]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-yellow-400 animate-pulse drop-shadow-lg">
        CineRate
      </h1>
      <h2 className="text-3xl font-bold text-center mb-6">
        Latest {selectedIndustry} Movies Reviews
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
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
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
