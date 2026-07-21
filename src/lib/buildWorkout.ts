import { rehabExercises } from "@/data/rehabExercises";
import type { Exercise, Workout } from "@/types/workout";
import { createId } from "@/utils/createId";

// Svinonts passgenerator. Till skillnad från Svinstark väljs inga övningar bort:
// varje pass använder samtliga rehabövningar exakt en gång, i 60-sekundersblock.
// Det som varierar är ORDNINGEN. I stället för ren slump ordnas övningarna efter
// enkla rehab-regler så att passet blir varierat men logiskt.
//
// Reglerna (hårda om inget annat sägs):
//   - alla övningar används exakt en gång          (garanteras av permutationen)
//   - inte två tunga knäövningar i rad             (hård)
//   - inte tre ryggövningar i rad                  (hård)
//   - minst en stabilitetsövning i passets första halva  (hård)
//   - minst en stabilitetsövning i passets andra halva   (hård)
//   - inte samma ordning som föregående pass        (hård)
//   - växla mellan rygg- och knäfokus när det går   (mjuk – maximeras)

// En "tung" knäövning är en belastad knästyrkeövning. Två sådana direkt efter
// varandra undviks för att inte överbelasta knät.
function isHeavyKnee(exercise: Exercise): boolean {
  return exercise.focus === "Knä" && exercise.category === "Styrka";
}

// Fisher-Yates-blandning som lämnar indata orörd.
function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Kontrollerar de hårda reglerna för en föreslagen ordning.
function satisfiesHardRules(order: Exercise[]): boolean {
  for (let i = 1; i < order.length; i++) {
    // Inte två tunga knäövningar i rad.
    if (isHeavyKnee(order[i]) && isHeavyKnee(order[i - 1])) return false;
    // Inte tre ryggövningar i rad.
    if (
      i >= 2 &&
      order[i].focus === "Rygg" &&
      order[i - 1].focus === "Rygg" &&
      order[i - 2].focus === "Rygg"
    ) {
      return false;
    }
  }

  const midpoint = Math.floor(order.length / 2);
  const isStability = (e: Exercise) => e.category === "Stabilitet";
  const firstHalfHasStability = order.slice(0, midpoint).some(isStability);
  const secondHalfHasStability = order.slice(midpoint).some(isStability);

  return firstHalfHasStability && secondHalfHasStability;
}

// Mjukt mått: antal gånger fokus växlar mellan grannar (rygg<->knä).
// Fler växlingar = mer varierat pass. Används för att välja bland de ordningar
// som redan uppfyller de hårda reglerna.
function focusAlternationScore(order: Exercise[]): number {
  let score = 0;
  for (let i = 1; i < order.length; i++) {
    if (order[i].focus !== order[i - 1].focus) score += 1;
  }
  return score;
}

function sameOrder(order: Exercise[], previousOrder: readonly string[]): boolean {
  return (
    order.length === previousOrder.length &&
    order.every((exercise, i) => exercise.id === previousOrder[i])
  );
}

// Hur många blandningar vi provar. Reglerna uppfylls i praktiken av de allra
// flesta blandningar, så detta är gott och väl tilltaget.
const MAX_ATTEMPTS = 200;

// Väljer en ordning som uppfyller de hårda reglerna, skiljer sig från
// föregående pass och har så hög fokusväxling som möjligt. Faller tillbaka på
// bästa möjliga kandidat om inget perfekt hittas (ska inte hända med nuvarande
// övningsbank, men gör generatorn robust mot framtida ändringar).
function pickOrder(previousOrder: readonly string[]): Exercise[] {
  let best: Exercise[] | null = null;
  let bestScore = -1;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = shuffled(rehabExercises);
    if (!satisfiesHardRules(candidate)) continue;
    if (sameOrder(candidate, previousOrder)) continue;

    const score = focusAlternationScore(candidate);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  // Nödutgång: bara blanda tills ordningen skiljer sig från föregående pass.
  if (!best) {
    let fallback = shuffled(rehabExercises);
    for (let attempt = 0; attempt < MAX_ATTEMPTS && sameOrder(fallback, previousOrder); attempt++) {
      fallback = shuffled(rehabExercises);
    }
    best = fallback;
  }

  return best;
}

// Bygger ett pass. previousOrder är övnings-id:na från föregående pass (i
// ordning) så att samma ordning inte upprepas två pass i rad; utelämna vid
// första passet. Resultatet har exakt samma form (Workout med WorkoutBlock[])
// som Svinstark, så den kopierade timern/passkärmen kör det oförändrat.
export function buildWorkout(previousOrder: readonly string[] = []): Workout {
  const order = pickOrder(previousOrder);

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
