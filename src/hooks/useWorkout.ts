"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { unlockAudioContext } from "@/lib/audio";
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
// När en övning löper ut går timern i väntläge (timerState.isAwaitingNext):
// nästa övning visas med full tid, men klockan startar först när användaren
// trycker igång den via startNextExercise().
//
// soundEnabled tas emot live (inte som en frusen kopia) eftersom ljudikonen
// visas och kan togglas på WorkoutScreen medan passet pågår.
export function useWorkout(soundEnabled: boolean) {
  const [screen, setScreen] = useState<Screen>("start");
  const [workout, setWorkout] = useState<Workout | null>(null);

  // Ordningen (övnings-id:n) för föregående pass, så att passgeneratorn kan
  // undvika att upprepa exakt samma ordning två pass i rad.
  const previousOrderRef = useRef<string[]>([]);

  const { playNewBlock, playCountdown, playHalfway, playFinish } = useAudio(soundEnabled);

  const handleFinish = useCallback(() => {
    playFinish();
    setScreen("finished");
  }, [playFinish]);

  const timerCallbacks = useMemo(
    () => ({
      onFinish: handleFinish,
      onBlockChange: playNewBlock,
      onCountdown: playCountdown,
      onHalfway: playHalfway,
    }),
    [handleFinish, playNewBlock, playCountdown, playHalfway]
  );

  const {
    timerState,
    pause: pauseTimer,
    resume: resumeTimer,
    stop: stopTimer,
    skip: skipTimer,
    startNextBlock,
  } = useTimer(workout, timerCallbacks);

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
    setWorkout(nextWorkout);
    setScreen("workout");
  }

  // Startar den väntande övningen (giltigt endast i timerns väntläge -
  // startNextBlock är själv en no-op annars). Startsignalen spelas via
  // timerns onBlockChange.
  function startNextExercise() {
    if (screen !== "workout") return;
    startNextBlock();
  }

  // Paus giltigt endast under en löpande övning (inte i väntläget, som redan
  // står stilla), återuppta endast från "paused".
  function pause() {
    if (screen !== "workout" || !timerState.isRunning) return;
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
    setWorkout(null);
    setScreen("start");
  }

  // Hoppar över aktuell/väntande övning. skipTimer avslutar passet själv (via
  // onFinish -> handleFinish) om det var sista övningen.
  function skip() {
    if (screen !== "workout") return;
    skipTimer();
  }

  function goToStart() {
    if (screen !== "finished") return;
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
    startNextExercise,
    pause,
    resume,
    stop,
    skip,
    goToStart,
  };
}
