import { rehabExercises } from "@/data/rehabExercises";
import type { Workout } from "@/types/workout";
import { createId } from "@/utils/createId";

// Varje rehabövning körs i exakt en minut.
const BLOCK_DURATION_SECONDS = 60;

// Svinonts motsvarighet till Svinstarks passgenerator, men utan slump eller
// regler: passet ÄR den fasta listan i data/rehabExercises.ts, i ordning, med
// ett 60-sekundersblock per övning. Resultatet har exakt samma form (Workout
// med WorkoutBlock[]) som Svinstark, så den kopierade timern/passkärmen kör
// det oförändrat.
export function buildWorkout(): Workout {
  return {
    id: createId(),
    createdAt: new Date(),
    blocks: rehabExercises.map((exercise) => ({
      id: createId(),
      duration: BLOCK_DURATION_SECONDS,
      exercise,
    })),
  };
}
