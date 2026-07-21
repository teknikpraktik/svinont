import type { Exercise } from "@/types/workout";

// Svinonts övningsbank: 14 skonsamma rehabövningar för rygg och knä.
// Varje pass använder samtliga övningar, en gång var, i 60 sekunder styck
// (se lib/buildWorkout.ts). Ordningen sätts av passgeneratorn och varierar
// mellan passen – listans ordning här har alltså ingen betydelse för passet.
//
// OBS: Det här är generiska rörlighets-/stabilitets-/styrkeövningar, INTE en
// medicinsk ordination. Följ det som är ordinerat för just dig.
export const DEFAULT_EXERCISE_DURATION_SECONDS = 60;

export const rehabExercises: Exercise[] = [
  // --- Rygg ---
  {
    id: "cat-camel",
    name: "Cat-camel",
    instruction: "Lugn rörelse mellan svank och rundad rygg.",
    category: "Mobilitet",
    focus: "Rygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "thoracic-rotation",
    name: "Thorakal rotation",
    instruction: "Rotera bröstryggen kontrollerat. Byt sida efter halva tiden.",
    category: "Mobilitet",
    focus: "Rygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "wall-slides",
    name: "Wall slides",
    instruction: "Rygg mot vägg. För armarna upp och ner med bibehållen kontakt.",
    category: "Mobilitet",
    focus: "Rygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "band-pull-aparts",
    name: "Band pull-aparts",
    instruction: "Dra bandet isär framför bröstet. Kläm ihop skulderbladen.",
    category: "Styrka",
    focus: "Rygg",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "face-pulls",
    name: "Face pulls",
    instruction: "Dra bandet mot ansiktet. Armbågarna högt, axlarna avslappnade.",
    category: "Styrka",
    focus: "Rygg",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "bird-dog",
    name: "Bird dog",
    instruction: "Sträck motsatt arm och ben. Håll bålen stabil. Växla sida.",
    category: "Stabilitet",
    focus: "Rygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "dead-bug",
    name: "Dead bug",
    instruction: "Ligg på rygg. Sänk motsatt arm och ben, håll ländryggen stilla. Växla sida.",
    category: "Stabilitet",
    focus: "Rygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  // --- Knä ---
  {
    id: "single-leg-balance",
    name: "Enbensbalans",
    instruction: "Stå stadigt på ett ben. Byt ben efter halva tiden.",
    category: "Stabilitet",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "wall-sit",
    name: "Wall sit",
    instruction: "Sitt mot väggen med knäna i cirka 90 grader. Håll positionen.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "step-down",
    name: "Step-down",
    instruction: "Kontrollerad sänkning. Låt knät följa fotens riktning. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "lateral-band-walk",
    name: "Sidogång med träningsband",
    instruction: "Träningsband runt benen. Gå i sidled, byt riktning efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "single-leg-hip-thrust",
    name: "Enbens höftlyft",
    instruction: "Ett ben i golvet. Lyft höften rakt upp, sänk kontrollerat. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "single-leg-calf-raise",
    name: "Enbens tåhävningar",
    instruction: "Stå på ett ben. Res dig på tå och sänk långsamt. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "gentle-knee-mobility",
    name: "Lätt knärörlighet",
    instruction: "Böj och sträck knät i skonsam, obelastad rörelse. Byt ben efter halva tiden.",
    category: "Mobilitet",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
];
