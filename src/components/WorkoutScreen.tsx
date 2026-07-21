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
  onStop: () => void;
  onSkip: () => void;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
}

// Under de sista sekunderna av en övning förhandsvisas nästa övning, så att
// användaren hinner byta position/utrustning utan att tappa tempo.
const NEXT_UP_SECONDS = 10;

export default function WorkoutScreen({
  blocks,
  block,
  timerState,
  soundEnabled,
  isPaused,
  onPause,
  onResume,
  onStop,
  onSkip,
  onSoundEnabledChange,
}: WorkoutScreenProps) {
  const exerciseProgress = getExerciseProgress(blocks, timerState.currentBlock);

  const nextBlock = blocks[timerState.currentBlock + 1] ?? null;
  const showNextUp = nextBlock !== null && timerState.remainingSeconds <= NEXT_UP_SECONDS;

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
        {/* Raden reserverar sin höjd även när den är tom, så att layouten
            inte hoppar när förhandsvisningen dyker upp. */}
        <p className={styles.nextUp}>
          {showNextUp ? `Nästa övning: ${nextBlock.exercise.name}` : " "}
        </p>
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
