import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core"
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import type { Movie } from "../types/movie";
import type { Tier, TierListData } from "../types/tier";
import { DEFAULT_TIERS } from "../types/tier"
import { useLocalStorage } from "../hooks/useLocalStorage";
import { TierRow } from "./TierRow";
import { MoviePoster } from "./MoviePoster";

interface Props {
  initialMovies: Movie[];
  onReset: () => void;
}

function buildInitialData(movies: Movie[]): TierListData {
  const movieMap: Record<string, Movie> = {};
  movies.forEach((m) => (movieMap[m.id] = m));

  const assignments: Record<string, string[]> = { pool: movies.map((m) => m.id) };
  DEFAULT_TIERS.forEach((t) => (assignments[t.id] = []));

  return { tiers: DEFAULT_TIERS, assignments, movies: movieMap };
}

function PoolZone({ movies }: { movies: Movie[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return (
    <div className="pool-section">
      <h3>Films non classés</h3>
      <div
        ref={setNodeRef}
        className={`pool-dropzone ${isOver ? "drag-over" : ""}`}
      >
        {movies.map((movie) => (
          <MoviePoster key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export function TierListScreen({ initialMovies, onReset }: Props) {
  const [data, setData] = useLocalStorage<TierListData>(
    "tierListData",
    buildInitialData(initialMovies)
  );

  const [newTierLabel, setNewTierLabel] = useState("");

  const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,      // ms avant que le drag démarre (laisse le temps de distinguer d'un scroll)
      tolerance: 8,     // pixels de tolérance de mouvement pendant le délai
    },
  })
);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const movieId = active.id as string;
    const targetZone = over.id as string;

    setData((prev) => {
      const newAssignments: Record<string, string[]> = {};
      // Retire le film de sa zone actuelle
      for (const zoneId in prev.assignments) {
        newAssignments[zoneId] = prev.assignments[zoneId].filter(
          (id) => id !== movieId
        );
      }
      // L'ajoute à la nouvelle zone
      newAssignments[targetZone] = [
        ...(newAssignments[targetZone] ?? []),
        movieId,
      ];

      return { ...prev, assignments: newAssignments };
    });
  }

  function handleRename(tierId: string, label: string) {
    setData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === tierId ? { ...t, label } : t)),
    }));
  }

  function handleDelete(tierId: string) {
    setData((prev) => {
      const movedBack = prev.assignments[tierId] ?? [];
      const newAssignments = { ...prev.assignments };
      delete newAssignments[tierId];
      newAssignments.pool = [...newAssignments.pool, ...movedBack];

      return {
        ...prev,
        tiers: prev.tiers.filter((t) => t.id !== tierId),
        assignments: newAssignments,
      };
    });
  }

  function handleAddTier() {
    if (!newTierLabel.trim()) return;
    const id = `tier-${Date.now()}`;
    const newTier: Tier = { id, label: newTierLabel, color: "#d1d5db" };

    setData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, newTier],
      assignments: { ...prev.assignments, [id]: [] },
    }));
    setNewTierLabel("");
  }

  function getMovies(ids: string[]): Movie[] {
    return ids.map((id) => data.movies[id]).filter(Boolean);
  }

  function handleReset() {
    localStorage.removeItem("tierListData");
    onReset();
  }

  return (
    <div className="app">
      <h1>Ma Tier List</h1>
        <button className="reset-btn" onClick={handleReset}>
          Nouvelle sélection
        </button>


      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="tiers-container">
          {data.tiers.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier}
              movies={getMovies(data.assignments[tier.id] ?? [])}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="add-tier-form">
          <input
            placeholder="Nom de la nouvelle catégorie"
            value={newTierLabel}
            onChange={(e) => setNewTierLabel(e.target.value)}
          />
          <button onClick={handleAddTier}>+ Ajouter une catégorie</button>
        </div>

        <PoolZone movies={getMovies(data.assignments.pool ?? [])} />
      </DndContext>
    </div>
  );
}