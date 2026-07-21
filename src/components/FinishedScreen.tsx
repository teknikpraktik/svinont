import PrimaryButton from "@/components/PrimaryButton";
import styles from "./FinishedScreen.module.css";

interface FinishedScreenProps {
  exerciseCount: number;
  onGoToStart: () => void;
}

export default function FinishedScreen({ exerciseCount, onGoToStart }: FinishedScreenProps) {
  return (
    <div className={styles.screen}>
      <p className={styles.message}>Klart!</p>
      <div className={styles.summary}>
        <p>{exerciseCount} övningar · {exerciseCount} min</p>
      </div>
      <PrimaryButton onClick={onGoToStart}>Till start</PrimaryButton>
    </div>
  );
}
