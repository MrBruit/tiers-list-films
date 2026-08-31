import { useDroppable } from "@dnd-kit/core";
import type { Tier } from "../types/tier";
import type { Movie } from "../types/movie";
import { MoviePoster } from "./MoviePoster";

interface Props {
  tier: Tier;
  movies: Movie[];
  onRename: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

export function TierRow({ tier, movies, onRename, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id });

  return (
    <div className="tier-row">
      <div className="tier-label" style={{ backgroundColor: tier.color }}>
        <input
          value={tier.label}
          onChange={(e) => onRename(tier.id, e.target.value)}
        />
        <button className="delete-btn" onClick={() => onDelete(tier.id)}>
          ×
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`tier-dropzone ${isOver ? "drag-over" : ""}`}
      >
        {movies.map((movie) => (
          <MoviePoster key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}