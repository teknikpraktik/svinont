// Domänmodell för Svinont. Behåller samma typnamn som Svinstark
// (Exercise, Workout, WorkoutBlock, TimerState, Screen) så att den oförändrat
// kopierade passmotorn (lib/timer.ts, hooks/useTimer.ts m.fl.) fungerar direkt.
//
// Skillnaden mot Svinstark: en rehabövning klassificeras med kategori och
// fokusområde. Passkärmen använder bara namn + instruktion, men passgeneratorn
// (lib/buildWorkout.ts) använder kategori och fokus för att skapa en varierad
// men logisk ordning.

// Övningens karaktär. Ren metadata för övningsbanken.
export type ExerciseCategory = "Mobilitet" | "Stabilitet" | "Styrka";

// Kroppsdel övningen riktar sig mot. Passgeneratorn kör strikt varannan
// knä- och varannan bröstryggsövning.
export type FocusArea = "Knä" | "Bröstrygg";

export interface Exercise {
  id: string;
  name: string;
  instruction: string;
  category: ExerciseCategory;
  focus: FocusArea;
  // Utrustning som behövs, t.ex. "Träningsband". Utelämnas om ingen krävs.
  equipment?: string;
  // Standardtid i sekunder. Alla rehabövningar körs i 60 sekunder.
  defaultDuration: number;
}

export interface WorkoutBlock {
  id: string;
  duration: number;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  createdAt: Date;
  blocks: WorkoutBlock[];
}

export interface TimerState {
  currentBlock: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  // Sant mellan två övningar: föregående block är klart och timern väntar på
  // att användaren själv startar nästa övning (currentBlock pekar då redan på
  // den kommande övningen, med full tid kvar).
  isAwaitingNext: boolean;
}

export type Screen = "start" | "workout" | "paused" | "finished";
