"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cancelSpeech, unlockAudioContext } from "@/lib/audio";
import { buildWorkout } from "@/lib/buildWorkout";
import { useAudio } from "@/hooks/useAudio";
import { useTimer } from "@/hooks/useTimer";
import { useWakeLock } from "@/hooks/useWakeLock";
import type { Screen, Workout } from "@/types/workout";

// Orkestrerar skärmflödet Start -> Workout -> Paused -> Finished -> Start.
// Samma struktur som Svinstarks useWorkout, men enklare: passet byggs ur
// rehab-övningsbanken (buildWorkout) och kan inte misslyckas - därför inget
// felhanterings-/återförsöksflöde och ingen settings-parameter till start().
//
// soundEnabled tas emot live (inte som en frusen kopia) eftersom ljudikonen
// visas och kan togglas på WorkoutScreen medan passet pågår.
export function useWorkout(soundEnabled: boolean) {
  const [screen, setScreen] = useState<Screen>("start");
  const [workout, setWorkout] = useState<Workout | null>(null);

  // Ordningen (övnings-id:n) för föregående pass, så att passgeneratorn kan
  // undvika att upprepa exakt samma ordning två pass i rad.
  const previousOrderRef = useRef<string[]>([]);

  // Spegel av workout-statet för timer-callbacks (onBlockChange/onHalfway),
  // som behöver slå upp övningen synkront utan att göra timern beroende av
  // React-statets renderingscykel.
  const workoutRef = useRef<Workout | null>(null);

  const { playNewBlock, playCountdown, playHalfway, playFinish, announceExercise } =
    useAudio(soundEnabled);

  const handleFinish = useCallback(() => {
    playFinish();
    setScreen("finished");
  }, [playFinish]);

  // Startsignal + röstuppläsning av den nya övningens namn.
  const handleBlockChange = useCallback(
    (blockIndex: number) => {
      playNewBlock();
      const block = workoutRef.current?.blocks[blockIndex];
      if (block) announceExercise(block.exercise.name);
    },
    [playNewBlock, announceExercise]
  );

  // Halvtidspip endast för övningar där användaren ska byta sida/ben.
  const handleHalfway = useCallback(
    (blockIndex: number) => {
      const block = workoutRef.current?.blocks[blockIndex];
      if (block?.exercise.switchSides) playHalfway();
    },
    [playHalfway]
  );

  const timerCallbacks = useMemo(
    () => ({
      onFinish: handleFinish,
      onBlockChange: handleBlockChange,
      onCountdown: playCountdown,
      onHalfway: handleHalfway,
    }),
    [handleFinish, handleBlockChange, playCountdown, handleHalfway]
  );

  const { timerState, pause: pauseTimer, resume: resumeTimer, stop: stopTimer, skip: skipTimer } = useTimer(
    workout,
    timerCallbacks
  );

  // Skärmen ska inte dimmas/släckas så länge ett pass pågår, även vid paus.
  useWakeLock(workout !== null);

  // Passet byggs och startar direkt vid knapptryckningen.
  function start() {
    // Måste ske synkront här, i själva knapptryckningen, annars förblir
    // ljudet permanent avstängt på mobila webbläsare (se lib/audio.ts).
    if (soundEnabled) {
      unlockAudioContext();
    }
    const nextWorkout = buildWorkout(previousOrderRef.current);
    previousOrderRef.current = nextWorkout.blocks.map((block) => block.exercise.id);
    workoutRef.current = nextWorkout;
    setWorkout(nextWorkout);
    setScreen("workout");
    // Uppläsningen av första övningen sker också synkront i knapptryckningen -
    // det låser samtidigt upp talsyntesen för resten av passet (se lib/audio.ts).
    announceExercise(nextWorkout.blocks[0].exercise.name);
  }

  // Paus giltigt endast från "workout", återuppta endast från "paused".
  function pause() {
    if (screen !== "workout") return;
    pauseTimer();
    setScreen("paused");
  }

  function resume() {
    if (screen !== "paused") return;
    resumeTimer();
    setScreen("workout");
  }

  function stop() {
    if (screen !== "workout" && screen !== "paused") return;
    stopTimer();
    cancelSpeech();
    workoutRef.current = null;
    setWorkout(null);
    setScreen("start");
  }

  // Giltigt endast under pågående pass. skipTimer avslutar passet själv (via
  // onFinish -> handleFinish) om det var sista övningen. Ingen startsignal vid
  // skip (avsiktligt tyst, se lib/timer.ts), men den nya övningens namn läses
  // upp - övningen börjar ju nu.
  function skip() {
    if (screen !== "workout") return;
    const stateAfterSkip = skipTimer();
    if (stateAfterSkip?.isRunning) {
      const block = workoutRef.current?.blocks[stateAfterSkip.currentBlock];
      if (block) announceExercise(block.exercise.name);
    }
  }

  function goToStart() {
    if (screen !== "finished") return;
    workoutRef.current = null;
    setWorkout(null);
    setScreen("start");
  }

  const currentBlock = workout?.blocks[timerState.currentBlock] ?? null;

  return {
    screen,
    workout,
    currentBlock,
    timerState,
    start,
    pause,
    resume,
    stop,
    skip,
    goToStart,
  };
}
