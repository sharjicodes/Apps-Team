import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

import MovieDetailsPage from "./components/MovieDetailsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
    </Routes>
  );
};

export default App;