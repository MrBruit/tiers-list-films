import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { searchMovies } from "../services/omdb";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  onValidate: (selection: Movie[]) => void;
}

export function SelectionScreen({ onValidate }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selection, setSelection] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    let cancelled = false;

    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const movies = await searchMovies(debouncedQuery);
      if (!cancelled) {
        setResults(movies);
        setLoading(false);
      }
    }

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  function toggleSelect(movie: Movie) {
    setSelection((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  }

  function isSelected(id: string) {
    return selection.some((m) => m.id === id);
  }

  return (
    <div className="app">
      <h1>Tier List Films</h1>

      <input
        type="text"
        placeholder="Rechercher un film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {loading && <p>Recherche...</p>}

      <div className="results-grid">
        {results.map((movie) => (
          <div
            key={movie.id}
            className={`movie-card ${isSelected(movie.id) ? "selected" : ""}`}
            onClick={() => toggleSelect(movie)}
          >
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title} ({movie.year})</p>
          </div>
        ))}
      </div>

      <div className="selection-bar">
        <p>{selection.length} film(s) sélectionné(s)</p>
        <button
          onClick={() => onValidate(selection)}
          disabled={selection.length === 0}
        >
          Valider ma sélection
        </button>
      </div>
    </div>
  );
}