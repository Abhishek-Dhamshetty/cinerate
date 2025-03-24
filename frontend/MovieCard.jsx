import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieCard = ({ movie, style }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRatings, setUserRatings] = useState(movie.userRatings || []);
  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }
  }, []);

  const onPlayerReady = (event) => {
    event.target.playVideo();
    event.target.mute();
    setPlayer(event.target);
  };

  const handleMouseEnter = () => {
    setShowTrailer(true);
    if (!player && window.YT?.Player) {
      const newPlayer = new window.YT.Player(`trailer-${movie._id}`, {
        playerVars: { autoplay: 1, mute: 1, controls: 0 },
        events: { onReady: onPlayerReady },
      });
      setPlayer(newPlayer);
    } else if (player) {
      player.playVideo();
    }
  };

  const handleMouseLeave = () => {
    setShowTrailer(false);
    player?.pauseVideo();
  };

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rateMovie`, {
        movieId: movie._id,
        rating,
      });

      if (response.status === 200) {
        setUserRatings([...userRatings, rating]);
        setRating(0);
        setIsRatingFormVisible(false);
        alert("Rating submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again later.");
    }
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-gray-900 text-white transition-transform hover:scale-105" style={style}>
      <div className="relative cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {showTrailer ? (
          <iframe
            id={`trailer-${movie._id}`}
            src={`${movie.trailerUrl.replace("watch?v=", "embed/")}?enablejsapi=1&autoplay=1&mute=1&controls=0`}
            title="trailer"
            className="w-full h-40 rounded-lg"
            allow="autoplay"
            allowFullScreen
          />
        ) : (
          <img src={movie.thumbnail} alt={movie.title} className="w-full h-40 rounded-lg" />
        )}
      </div>

      <h3 className="text-xl font-bold mt-2">{movie.title}</h3>
      <p>IMDB Rating: {movie.imdbRating}/10</p>
      <p>CBFC: {movie.cbfc}</p>
      <p>Genre: {movie.genre}</p>
      <p className="text-yellow-400 font-semibold">
        User Rating: ⭐{" "}
        {userRatings.length ? (userRatings.reduce((a, b) => a + b, 0) / userRatings.length).toFixed(1) : "0"}{" "}
        / 5
      </p>

      <button onClick={() => setIsRatingFormVisible(!isRatingFormVisible)} className="mt-2 bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded">
        {isRatingFormVisible ? "Cancel" : "Rate"}
      </button>

      {isRatingFormVisible && (
        <div className="mt-2 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button onClick={handleSubmitRating} className="mt-2 bg-green-500 hover:bg-green-700 px-3 py-1 rounded">
            Submit
          </button>
        </div>
      )}

      <div className="mt-3 flex justify-between">
        <a href={movie.youtubeLink} target="_blank" rel="noopener noreferrer" className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded">
          Watch Trailer
        </a>
        <a href={movie.bookMyShowLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded">
          Book Tickets
        </a>
      </div>
    </div>
  );
};

export default MovieCard;
