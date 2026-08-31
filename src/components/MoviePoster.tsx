import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Movie } from "../types/movie";

interface Props {
  movie: Movie;
}

export function MoviePoster({ movie }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: movie.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="poster"
      title={movie.title}
    >
      <img src={movie.poster} alt={movie.title} />
    </div>
  );
}