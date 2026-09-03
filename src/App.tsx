import { useState } from "react";
import type { Movie } from "./types/movie";
import { SelectionScreen } from "./components/SelectionScreen";
import { TierListScreen } from "./components/TierListScreen";
import "./App.css";

function App() {
  const [validatedMovies, setValidatedMovies] = useState<Movie[] | null>(null);

  function handleReset() {
    setValidatedMovies(null);
  }

  if (validatedMovies) {
    return <TierListScreen initialMovies={validatedMovies} onReset={handleReset} />;
  }

  return <SelectionScreen onValidate={setValidatedMovies} onReset={handleReset}/>;
}

export default App;