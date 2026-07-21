import ExerciseCard from "@/components/ExerciseCard";
import IconButton from "@/components/IconButton";
import TimerDisplay from "@/components/TimerDisplay";
import WorkoutProgress from "@/components/WorkoutProgress";
import { getExerciseProgress } from "@/lib/timer";
import type { TimerState, WorkoutBlock } from "@/types/workout";
import styles from "./WorkoutScreen.module.css";

interface WorkoutScreenProps {
  blocks: WorkoutBlock[];
  block: WorkoutBlock;
  timerState: TimerState;
  soundEnabled: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStartNext: () => void;
  onStop: () => void;
  onSkip: () => void;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
}

export default function WorkoutScreen({
  blocks,
  block,
  timerState,
  soundEnabled,
  isPaused,
  onPause,
  onResume,
  onStartNext,
  onStop,
  onSkip,
  onSoundEnabledChange,
}: WorkoutScreenProps) {
  const exerciseProgress = getExerciseProgress(blocks, timerState.currentBlock);

  // Väntläge mellan två övningar: nästa övning visas med full tid och startas
  // av användaren via den stora Starta-knappen.
  const isAwaitingNext = timerState.isAwaitingNext;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.summary}>Rehabprogram · {blocks.length} min</p>
        </div>
        <div className={styles.soundButton}>
          <IconButton
            icon={soundEnabled ? "🔊" : "🔇"}
            ariaLabel={soundEnabled ? "Stäng av ljud" : "Sätt på ljud"}
            onClick={() => onSoundEnabledChange(!soundEnabled)}
            size="large"
          />
        </div>
      </div>

      <TimerDisplay seconds={timerState.remainingSeconds} totalSeconds={block.duration} />

      <div className={styles.content}>
        <ExerciseCard name={block.exercise.name} instruction={block.exercise.instruction} />
        <WorkoutProgress current={exerciseProgress.current} total={exerciseProgress.total} />
      </div>

      <div className={styles.skipRow}>
        {!isPaused && (
          <button className={styles.skipButton} onClick={onSkip}>
            Hoppa över
          </button>
        )}
      </div>

      <div className={styles.actions}>
        {isPaused ? (
          <button className={styles.actionButton} onClick={onResume}>
            Fortsätt
          </button>
        ) : isAwaitingNext ? (
          <button className={`${styles.actionButton} ${styles.actionButtonAccent}`} onClick={onStartNext}>
            Starta
          </button>
        ) : (
          <button className={styles.actionButton} onClick={onPause}>
            Paus
          </button>
        )}
        <button className={styles.actionButton} onClick={onStop}>
          Avsluta
        </button>
      </div>
    </div>
  );
}
