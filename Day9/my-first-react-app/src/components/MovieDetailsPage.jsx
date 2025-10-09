import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [movieWatch, setMovieWatch] = useState("");

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    try {
      const movieResponse = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
      const movieData = await movieResponse.json();

      const videoResponse = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
      const videoData = await videoResponse.json();

      const videoWatch = await fetch(`${API_BASE_URL}/movie/${id}/watch/providers`, API_OPTIONS);
      const videoWatchData = await videoWatch.json();



      const trailer = videoData.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      setMovie(movieData);
      setTrailerKey(trailer ? trailer.key : "");
      setMovieWatch(videoWatchData);
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (isLoading)
    return <p className="text-center text-lg text-gray-400 mt-10">Loading...</p>;
  if (!movie)
    return <p className="text-center text-lg text-gray-400 mt-10">Movie Not Found!</p>;

  return (
    <div className="bg-[#050517] min-h-screen text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        
        <Link
          to="/"
          className="text-purple-400 underline mb-6 inline-block hover:text-purple-300"
        >
          ← Back to Home
        </Link>

       
        {trailerKey ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "/no-movie.png"
            }
            alt={movie.title}
            className="rounded-lg mb-8 w-[300px] mx-auto"
          />
        )}

        

          <div className="flex flex-wrap  gap-3 w-full sm:w-auto">
<button
  onClick={() => {
    const region = "IN"; // or detect user’s country dynamically
    const link = movieWatch?.results?.[region]?.link;

    if (link) {
      window.open(link, "_blank");
    } else {
      alert("Watch link not available for this region.");
    }
  }}
  type="button"
  className="flex-1 sm:flex-none text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 transition-all min-w-[110px] text-center"
>
  🎬 Play Movie
</button>
</div>
            <p>
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"} •{" "}
              {movie.runtime} min
            </p>
            
          

         <p>⭐ {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)</p>

          <h2 className="text-lg font-semibold mb-1 text-purple-300">Overview</h2>
          <p className="text-gray-300 mb-5 leading-relaxed">{movie.overview}</p>

          <div className="flex justify-between text-gray-400 text-sm mb-3">
            <div>
              <p className="text-gray-400">Release Date</p>
              <p className="text-white">{movie.release_date}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-white">{movie.status}</p>
            </div>
            </div>
            <div>
              <p className="text-gray-400">Genres</p>
              <p className="inline-block px-2 py-1 bg-[#1a1a3d] border border-purple-900 text-purple-100  text-sm ">{movie.genres.map((g) => g.name).join(", ")}</p>
            </div>

             <div>
              <p className="text-gray-400">Country</p>
              
              <p className=" inline-block px-2 py-1 bg-[#1a1a3d] border border-purple-900 text-purple-100  text-sm ">{movie.production_countries?.[0]?.name || "Unknown"}</p>
              
            </div>

            <div className="flex justify-between text-gray-400 text-sm mb-3">
            <div>
              <p className="text-gray-400">Budget</p>
              <p className="text-white">${(movie.budget / 1_000_000).toFixed(1)} million</p>
            </div>
            <div>
              <p className="text-gray-400">Revenue</p>
              <p className="text-white">${(movie.revenue / 1_000_000).toFixed(1)} million</p>
            </div>
            </div>

            <div className="col-span-2 sm:col-span-3">
              <p className="text-gray-400">Production Companies</p>
              <p>
                {movie.production_companies
                  ?.map((c) => c.name)
                  .join(" · ") || "N/A"}
              </p>
            </div>
          </div>
       </div>
      
    
  );
};

export default MovieDetails;
