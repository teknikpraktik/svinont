"use client";

import FinishedScreen from "@/components/FinishedScreen";
import StartScreen from "@/components/StartScreen";
import WorkoutScreen from "@/components/WorkoutScreen";
import { useSettings } from "@/hooks/useSettings";
import { useWorkout } from "@/hooks/useWorkout";
import { unlockAudioContext } from "@/lib/audio";

export default function Home() {
  const { settings, setSoundEnabled } = useSettings();
  const {
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
  } = useWorkout(settings.soundEnabled);

  if (screen === "start") {
    return <StartScreen onStart={start} />;
  }

  if (screen === "finished") {
    return <FinishedScreen onStartNew={start} onGoToStart={goToStart} />;
  }

  if (!currentBlock || !workout) return null;

  return (
    <WorkoutScreen
      blocks={workout.blocks}
      block={currentBlock}
      timerState={timerState}
      soundEnabled={settings.soundEnabled}
      isPaused={screen === "paused"}
      onPause={pause}
      onResume={resume}
      onStop={stop}
      onSkip={skip}
      onSoundEnabledChange={(soundEnabled) => {
        // Måste låsas upp här också: om ljudet var avstängt när passet
        // startade och användaren slår på det med ikonen mitt i passet är
        // detta den enda riktiga knapptryckning webbläsaren har att låsa upp
        // AudioContext med (se lib/audio.ts).
        if (soundEnabled) unlockAudioContext();
        setSoundEnabled(soundEnabled);
      }}
    />
  );
}
