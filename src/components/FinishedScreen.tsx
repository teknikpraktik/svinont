import styles from "./FinishedScreen.module.css";

interface FinishedScreenProps {
  onGoToStart: () => void;
}

// Avskalad slutsida: ett lugnt kvitto och en väg tillbaka. Medvetet ingen
// statistik, poäng eller gamification - passet är klart, det räcker.
export default function FinishedScreen({ onGoToStart }: FinishedScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.message}>
        <p className={styles.headline}>Passet är klart</p>
        <p className={styles.sub}>Bra jobbat.</p>
        <p className={styles.sub}>Vi ses imorgon.</p>
      </div>

      <button className={styles.homeButton} onClick={onGoToStart}>
        Till startsidan
      </button>
    </div>
  );
}
