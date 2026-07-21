"use client";

import { useCallback } from "react";
import {
  playCountdownBeep,
  playFinishSound,
  playHalfwayBeep,
  playNewBlockSound,
  speakExerciseName,
} from "@/lib/audio";

// Spelar ljud endast om inställningen är påslagen (C.19: "Ljud ska kunna
// stängas av"). Hooken innehåller ingen ljudlogik själv, den använder bara
// funktionerna i lib/audio.ts.
export function useAudio(enabled: boolean) {
  const playNewBlock = useCallback(() => {
    if (enabled) playNewBlockSound();
  }, [enabled]);

  const playCountdown = useCallback(() => {
    if (enabled) playCountdownBeep();
  }, [enabled]);

  const playHalfway = useCallback(() => {
    if (enabled) playHalfwayBeep();
  }, [enabled]);

  const playFinish = useCallback(() => {
    if (enabled) playFinishSound();
  }, [enabled]);

  const announceExercise = useCallback(
    (name: string) => {
      if (enabled) speakExerciseName(name);
    },
    [enabled]
  );

  return { playNewBlock, playCountdown, playHalfway, playFinish, announceExercise };
}
