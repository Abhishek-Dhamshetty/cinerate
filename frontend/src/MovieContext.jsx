import { createContext, useState } from "react";
import allMoviesData from "../src/MoviesData"; // Separate file for movie data

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState(allMoviesData);

  const updateRating = (movieId, rating) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === movieId
          ? { ...movie, userRatings: [...movie.userRatings, rating] }
          : movie
      )
    );
  };

  return (
    <MovieContext.Provider value={{ movies, updateRating }}>
      {children}
    </MovieContext.Provider>
  );
};
