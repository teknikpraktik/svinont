// Minimal domänmodell för Svinont. Behåller samma typnamn som Svinstark
// (Exercise, Workout, WorkoutBlock, TimerState, Screen) så att den oförändrat
// kopierade passmotorn (lib/timer.ts, hooks/useTimer.ts m.fl.) fungerar direkt.
// Skillnaden mot Svinstark: en Exercise behöver bara det passkärmen visar
// (namn + instruktion) - ingen klassificering, utrustning eller intensitet,
// eftersom Svinont kör ett fast program utan generatorlogik.

export interface Exercise {
  id: string;
  name: string;
  instruction: string;
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
}

export type Screen = "start" | "workout" | "paused" | "finished";
