import { rehabExercises } from "@/data/rehabExercises";
import type { Exercise, Workout } from "@/types/workout";
import { createId } from "@/utils/createId";

// Svinonts passgenerator. Varje pass använder samtliga övningar exakt en gång,
// i 60-sekundersblock. Ordningen följer en enkel regel: strikt varannan knä-
// och varannan bröstryggsövning (7 + 7 = perfekt alternering). Vilken grupp
// som börjar slumpas, liksom ordningen inom varje grupp. Samma ordning ska om
// möjligt inte upprepas två pass i rad.

// Fisher-Yates-blandning som lämnar indata orörd.
function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Blandar båda grupperna, slumpar startgrupp och flätar ihop dem varannan.
function interleavedOrder(): Exercise[] {
  const knee = shuffled(rehabExercises.filter((e) => e.focus === "Knä"));
  const thoracic = shuffled(rehabExercises.filter((e) => e.focus === "Bröstrygg"));

  const [first, second] = Math.random() < 0.5 ? [knee, thoracic] : [thoracic, knee];

  const order: Exercise[] = [];
  for (let i = 0; i < Math.max(first.length, second.length); i++) {
    if (first[i]) order.push(first[i]);
    if (second[i]) order.push(second[i]);
  }
  return order;
}

function sameOrder(order: Exercise[], previousOrder: readonly string[]): boolean {
  return (
    order.length === previousOrder.length &&
    order.every((exercise, i) => exercise.id === previousOrder[i])
  );
}

// Med 7! × 7! × 2 möjliga ordningar är en upprepning i praktiken omöjlig,
// men regeln "inte samma ordning två pass i rad" garanteras ändå billigt.
const MAX_ATTEMPTS = 20;

// Bygger ett pass. previousOrder är övnings-id:na från föregående pass (i
// ordning) så att samma ordning inte upprepas två pass i rad; utelämna vid
// första passet. Resultatet har exakt samma form (Workout med WorkoutBlock[])
// som Svinstark, så den kopierade timern/passkärmen kör det oförändrat.
export function buildWorkout(previousOrder: readonly string[] = []): Workout {
  let order = interleavedOrder();
  for (let attempt = 0; attempt < MAX_ATTEMPTS && sameOrder(order, previousOrder); attempt++) {
    order = interleavedOrder();
  }

  return {
    id: createId(),
    createdAt: new Date(),
    blocks: order.map((exercise) => ({
      id: createId(),
      duration: exercise.defaultDuration,
      exercise,
    })),
  };
}
