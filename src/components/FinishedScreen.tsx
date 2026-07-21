import PrimaryButton from "@/components/PrimaryButton";
import styles from "./FinishedScreen.module.css";

interface FinishedScreenProps {
  onStartNew: () => void;
  onGoToStart: () => void;
}

// Avskalad slutsida: ett lugnt kvitto och två vägar vidare. Medvetet ingen
// statistik, poäng eller gamification - passet är klart, det räcker.
export default function FinishedScreen({ onStartNew, onGoToStart }: FinishedScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.message}>
        <p className={styles.headline}>Passet är klart</p>
        <p className={styles.sub}>Bra jobbat.</p>
        <p className={styles.sub}>Vi ses imorgon.</p>
      </div>

      <div className={styles.actions}>
        <PrimaryButton onClick={onStartNew}>Starta nytt pass</PrimaryButton>
        <button className={styles.secondaryButton} onClick={onGoToStart}>
          Till startsidan
        </button>
      </div>
    </div>
  );
}
