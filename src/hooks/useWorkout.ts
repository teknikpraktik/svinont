"use client";

import { useCallback, useMemo, useState } from "react";
import { unlockAudioContext } from "@/lib/audio";
import { buildWorkout } from "@/lib/buildWorkout";
import { useAudio } from "@/hooks/useAudio";
import { useTimer } from "@/hooks/useTimer";
import { useWakeLock } from "@/hooks/useWakeLock";
import type { Screen, Workout } from "@/types/workout";

// Orkestrerar skärmflödet Start -> Workout -> Paused -> Finished -> Start.
// Samma struktur som Svinstarks useWorkout, men enklare: passet byggs ur den
// fasta rehab-listan (buildWorkout) i stället för att slumpas, så det kan inte
// misslyckas - därför inget felhanterings-/återförsöksflöde och ingen
// settings-parameter till start().
//
// soundEnabled tas emot live (inte som en frusen kopia) eftersom ljudikonen
// visas och kan togglas på WorkoutScreen medan passet pågår.
export function useWorkout(soundEnabled: boolean) {
  const [screen, setScreen] = useState<Screen>("start");
  const [workout, setWorkout] = useState<Workout | null>(null);

  const { playNewBlock, playCountdown, playFinish } = useAudio(soundEnabled);

  const handleFinish = useCallback(() => {
    playFinish();
    setScreen("finished");
  }, [playFinish]);

  const timerCallbacks = useMemo(
    () => ({ onFinish: handleFinish, onBlockChange: playNewBlock, onCountdown: playCountdown }),
    [handleFinish, playNewBlock, playCountdown]
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
    setWorkout(buildWorkout());
    setScreen("workout");
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
    setWorkout(null);
    setScreen("start");
  }

  // Giltigt endast under pågående pass. skipTimer avslutar passet själv (via
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
    pause,
    resume,
    stop,
    skip,
    goToStart,
  };
}
