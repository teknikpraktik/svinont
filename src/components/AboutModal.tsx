import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import styles from "./AboutModal.module.css";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.text}>
        <h2 className={styles.title}>Om Svinont</h2>

        <p>
          Svinont hjälper dig att genomföra ett enkelt dagligt rehabpass. Alla
          övningar ingår i varje pass, men ordningen varierar för att skapa ett
          omväxlande och balanserat upplägg.
        </p>

        <p className={styles.disclaimer}>
          Appen ersätter inte individuell bedömning eller behandling av
          fysioterapeut, läkare eller annan vårdpersonal. Anpassa alltid
          träningen efter dina egna besvär och avbryt om smärtan ökar tydligt
          eller om nya symtom uppstår.
        </p>

        <p>
          Målet är enkelt: mindre friktion, bättre kontinuitet och en rehab som
          faktiskt blir av.
        </p>
      </div>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
