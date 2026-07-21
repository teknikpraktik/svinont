import type { Exercise } from "@/types/workout";

// Svinonts övningsbank: 7 knäövningar och 7 bröstryggsövningar.
// Varje pass använder samtliga övningar, en gång var, i 60 sekunder styck.
// Passgeneratorn (lib/buildWorkout.ts) kör strikt varannan knä, varannan
// bröstrygg med slumpad startövning - listans ordning här spelar ingen roll.
//
// `switchSides: true` betyder att användaren ska byta sida/ben efter halva
// tiden; de övningarna får ett påminnelsepip vid 30 sekunder.
//
// OBS: Det här är generiska rehabövningar, INTE en medicinsk ordination.
// Följ det som är ordinerat för just dig.
export const DEFAULT_EXERCISE_DURATION_SECONDS = 60;

export const rehabExercises: Exercise[] = [
  // --- Knä (7) ---
  {
    id: "spanish-squat",
    name: "Spansk knäböj",
    instruction:
      "Band bakom knävecken, fäst i dörrhandtag eller räcke. Sätt dig bakåt med rak rygg.",
    category: "Styrka",
    focus: "Knä",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "pain-free-squat",
    name: "Knäböj i smärtfritt djup",
    instruction: "Grundmönstret. Öka djupet successivt - håll dig smärtfri.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "step-down",
    name: "Step-down",
    instruction:
      "Kontrollerad sänkning från låg kant. Knät i linje över foten. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  {
    id: "split-squat",
    name: "Split squat",
    instruction: "Dosera med steglängden. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  {
    id: "hip-abduction-band",
    name: "Höftabduktion med band",
    instruction:
      "Band runt knäna. Sidosteg eller sidliggande lyft. Byt sida efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  {
    id: "single-leg-hip-thrust",
    name: "Enbent höftlyft",
    instruction: "Ett ben i golvet. Lyft höften rakt upp. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  {
    id: "single-leg-rdl",
    name: "Enbent rumänsk marklyft",
    instruction:
      "Fäll framåt på ett ben med rak rygg. Stå på bandet för motstånd. Byt ben efter halva tiden.",
    category: "Styrka",
    focus: "Knä",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  // --- Bröstrygg (7) ---
  {
    id: "open-book",
    name: "Open book-rotation",
    instruction:
      "Sidliggande. Rotera övre armen ut och följ med blicken. Byt sida efter halva tiden.",
    category: "Mobilitet",
    focus: "Bröstrygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
    switchSides: true,
  },
  {
    id: "cat-cow",
    name: "Katt-ko",
    instruction: "Mjuk genomrörelse mellan svank och rundad rygg.",
    category: "Mobilitet",
    focus: "Bröstrygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "wall-slides",
    name: "Wall slides",
    instruction: "Rygg mot vägg. För armarna upp och ner med bibehållen kontakt.",
    category: "Mobilitet",
    focus: "Bröstrygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "childs-pose-breathing",
    name: "Djupandning i barnets position",
    instruction: "Knästående framåtfälld. Andas djupt in i revben och bröstrygg.",
    category: "Mobilitet",
    focus: "Bröstrygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "band-row",
    name: "Rodd med band",
    instruction: "Fäst bandet i dörr eller räcke. Dra mot magen, kläm ihop skulderbladen.",
    category: "Styrka",
    focus: "Bröstrygg",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "band-pull-apart",
    name: "Pull-apart med band",
    instruction: "Håll bandet framför dig, dra isär. Samla skulderbladen.",
    category: "Styrka",
    focus: "Bröstrygg",
    equipment: "Träningsband",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
  {
    id: "bird-dog",
    name: "Bird dog",
    instruction: "Sträck motsatt arm och ben. Håll bålen stabil. Växla sida.",
    category: "Stabilitet",
    focus: "Bröstrygg",
    defaultDuration: DEFAULT_EXERCISE_DURATION_SECONDS,
  },
];
