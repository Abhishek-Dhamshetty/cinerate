import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieCard = ({ movie, style }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRatings, setUserRatings] = useState(movie.userRatings || []);
  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false);
  const [player, setPlayer] = useState(null);

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
  event.target.unMute(); // ✅ Unmute immediately
  setPlayer(event.target);
};

const handleMouseEnter = () => {
  setShowTrailer(true);

  if (!player && window.YT) {
    const newPlayer = new window.YT.Player(`trailer-${movie._id}`, {
      events: { onReady: onPlayerReady },
    });
    setPlayer(newPlayer);
  } else if (player) {
    player.playVideo();
    player.unMute(); // ✅ Ensure sound
  }
};

const handleMouseLeave = () => {
  setShowTrailer(false);
  if (player) {
    player.pauseVideo(); // ✅ Pause instead of stop (prevents reload lag)
  }
};

  

  return (
    <div
      className="border rounded-lg shadow-lg p-4 bg-gray-800 text-white transition-transform transform hover:scale-105"
      style={style} // ✅ Ensuring the width is applied correctly
    >
      <div
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        
      >
        {showTrailer ? (
          <div className="w-full h-40 rounded-lg">
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
          </div>
        ) : (
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-50 rounded-lg"
          />
        )}
      </div>
      <h3 className="text-xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500" >{movie.title}</h3>
      <p style={{color:"gold"}}>IMDB Rating: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">{movie.imdbRating}/10</span></p>
      <p style={{color:"gold"}}>CBFC:  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">{movie.cbfc}</span></p>
      <p style={{color:"gold"}}>Genre: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">{movie.genre}</span></p>
      <p className="text-yellow-400 font-semibold" >
        User Rating: ⭐{" "}
        {userRatings.length
            ? (userRatings.reduce((a, b) => a + b, 0) / userRatings.length).toFixed(1)
            : "0"}{" "}
        / 5 ({userRatings.length} votes)
        </p>


      <button
        onClick={() => setIsRatingFormVisible(!isRatingFormVisible)}
        className="mt-2 bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded transition-all"
        style={{background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))"}}
      >
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
          <button
            onClick={async () => {
              if (rating < 1 || rating > 5) {
                alert("Please select a rating between 1 and 5.");
                return;
              }
              try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rateMovie`, {
                  movieId: movie._id,
                  rating,
                });
                setUserRatings([...userRatings, rating]);
                setRating(0);
                setIsRatingFormVisible(false);
              } catch (error) {
                console.error("Error submitting rating:", error);
              }
            }}
            className="mt-2 bg-green-500 hover:bg-green-700 px-3 py-1 rounded transition-all"
            style={{background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))"}}
          >
            Submit
          </button>
        </div>
      )}

      <div className="mt-3 flex justify-between">
        <a
          href={movie.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded transition-all"
          style={{background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))"}}
        >
          Watch Trailer
        </a>
        <a
          href={movie.bookMyShowLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded transition-all" 
          style={{background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234), rgb(236, 72, 153))"}}
        >
          Book Tickets
        </a>
      </div>
    </div>
  );
};

export default MovieCard;
