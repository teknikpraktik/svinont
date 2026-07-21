import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import styles from "./AboutModal.module.css";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Platshållartext för Svinont. Fyll i med appens riktiga syfte och ev.
// disclaimer om att övningarna inte ersätter medicinsk rådgivning.
export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.text}>
        <h2 className={styles.title}>Om Svinont</h2>

        <p className={styles.intro}>
          Ett enkelt, fast rehabprogram – tryck igång och följ med, en övning i taget.
        </p>
        <p>
          Systerapp till Svinstark med samma passupplägg: en tydlig timer,
          ljudsignal vid varje ny övning och en nedräkning på slutet. Skillnaden
          är att Svinont kör samma bestämda övningar varje gång, i en minut var –
          inga val, ingen slump.
        </p>

        <h3>Så funkar det</h3>
        <ul>
          <li>Tryck STARTA – programmet börjar direkt.</li>
          <li>Varje övning pågår i en minut.</li>
          <li>En signal ljuder när det är dags att byta.</li>
        </ul>

        <p className={styles.disclaimer}>
          Övningarna ersätter inte råd från läkare eller fysioterapeut. Följ det
          som är ordinerat för just dig.
        </p>

        <h3>Feedback</h3>
        <p>
          Har du synpunkter eller hittat en bugg?{" "}
          <a className={styles.link} href="mailto:per.a.bjorkman@gmail.com">
            Mejla mig
          </a>
          .
        </p>
      </div>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
