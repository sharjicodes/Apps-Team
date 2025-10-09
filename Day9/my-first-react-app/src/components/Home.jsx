import React, { useState, useEffect } from "react";
import Search from "./Search"
import MovieCard from "./MovieCard"
import Spinner from "./Spinner"
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
//API-Application Programming Interface
const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortType , setSortType ] =useState('popularity.desc');
  const [movieLanguage , setMovieLanguage] = useState('en');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=${sortType}&with_original_language=${movieLanguage}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "false") {
        setErrorMessage(Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.log(`error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies.please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm , sortType ,movieLanguage]);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
         <div className="flex flex-wrap justify-center items-center gap-3 mt-4 px-2 w-full">
  {/* Sort Buttons */}
  <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto">
    <button
      onClick={() => setSortType("popularity.desc")}
      type="button"
      className="flex-1 sm:flex-none text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 transition-all min-w-[110px] text-center"
    >
      Popularity
    </button>

    <button
      onClick={() => setSortType("vote_average.desc")}
      type="button"
      className="flex-1 sm:flex-none text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 transition-all min-w-[110px] text-center"
    >
      Rating
    </button>

    <button
      onClick={() => setSortType("release_date.desc")}
      type="button"
      className="flex-1 sm:flex-none text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 transition-all min-w-[120px] text-center"
    >
      Release Date
    </button>
  </div>

  {/* Language Dropdown */}
  <div className="w-full sm:w-auto flex justify-center">
    <select
      value={movieLanguage}
      onChange={(e) => setMovieLanguage(e.target.value)}
      className="w-[160px] text-sm font-medium rounded-full px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer transition-all"
    >
      <option className="bg-white text-black dark:bg-gray-800 dark:text-white" value="en">
        English
      </option>
      <option className="bg-white text-black dark:bg-gray-800 dark:text-white" value="ml">
        Malayalam
      </option>
      <option className="bg-white text-black dark:bg-gray-800 dark:text-white" value="hi">
        Hindi
      </option>
      <option className="bg-white text-black dark:bg-gray-800 dark:text-white" value="ja">
        Japanese
      </option>
      <option className="bg-white text-black dark:bg-gray-800 dark:text-white" value="ko">
        Korean
      </option>
    </select>
  </div>
</div>


        </header>

        <section className="all-movies">
          <h2 className="mt-[20px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
