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
    if (isMuted) {
      event.target.mute();
    } else {
      event.target.unMute();
    }
    setPlayer(event.target);
  };

  const handleMouseEnter = () => {
    setShowTrailer(true);
    if (!player && window.YT && window.YT.Player) {
      const newPlayer = new window.YT.Player(`trailer-${movie._id}`, {
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          fs: 0,
        },
        events: { onReady: onPlayerReady },
      });
      setPlayer(newPlayer);
    } else if (player) {
      player.playVideo();
    }
  };

  const handleMouseLeave = () => {
    setShowTrailer(false);
    if (player) {
      player.pauseVideo();
    }
  };

  const handleUnmute = () => {
    if (player) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-gray-900 text-white transition-transform transform hover:scale-105" style={style}>
      <div className="relative cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {showTrailer ? (
          <div className="w-full h-40 rounded-lg relative">
            <div id={`trailer-container-${movie._id}`}>
              <iframe
                id={`trailer-${movie._id}`}
                src={`${movie.trailerUrl.replace("watch?v=", "embed/")}?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0`}
                title="trailer"
                className="w-full h-full rounded-lg"
                allow="autoplay"
                allowFullScreen
                onLoad={() => {
                  setTimeout(() => {
                    if (window.YT && window.YT.Player) {
                      const newPlayer = new window.YT.Player(
                        `trailer-${movie._id}`,
                        {
                          playerVars: {
                            autoplay: 1,
                            mute: 1,
                            controls: 0,
                            modestbranding: 1,
                            showinfo: 0,
                            rel: 0,
                            fs: 0,
                          },
                          events: { onReady: onPlayerReady },
                        }
                      );
                      setPlayer(newPlayer);
                    }
                  }, 500);
                }}
              ></iframe>
            </div>
            {isMuted && (
              <button onClick={handleUnmute} className="absolute bottom-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-lg">
                🔊 Unmute
              </button>
            )}
          </div>
        ) : (
          <img src={movie.thumbnail} alt={movie.title} className="w-full h-40 rounded-lg" />
        )}
      </div>
      <h3 className="text-xl font-bold mt-2">{movie.title}</h3>
      <p>IMDB Rating: {movie.imdbRating}/10</p>
      <p>CBFC: {movie.cbfc}</p>
      <p>Genre: {movie.genre}</p>
      <p className="text-yellow-400 font-semibold">
        User Rating: ⭐ {userRatings.length ? (userRatings.reduce((a, b) => a + b, 0) / userRatings.length).toFixed(1) : "0"} / 5
      </p>
      <button onClick={() => setIsRatingFormVisible(!isRatingFormVisible)} className="mt-2 bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded transition-all">
        {isRatingFormVisible ? "Cancel" : "Rate"}
      </button>
      {isRatingFormVisible && (
        <div className="mt-2 flex flex-col items-center">
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-500"}`} onClick={() => handleStarClick(star)}>
                ★
              </span>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={async () => {
                try {
                  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/movie-api/rate-movie`, {
                    title: movie.title,
                    rating,
                  });
                  setUserRatings([...userRatings, rating]);
                  setRating(0);
                  setIsRatingFormVisible(false);
                } catch (error) {
                  console.error("Error submitting rating:", error);
                }
              }}
              className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded transition-all"
            >
              Submit
            </button>
            <button onClick={() => setIsRatingFormVisible(false)} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;