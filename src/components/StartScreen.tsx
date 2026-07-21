"use client";

import { useState } from "react";
import AboutModal from "@/components/AboutModal";
import IconButton from "@/components/IconButton";
import InstallPrompt from "@/components/InstallPrompt";
import PrimaryButton from "@/components/PrimaryButton";
import { rehabExercises } from "@/data/rehabExercises";
import styles from "./StartScreen.module.css";

const valueProps = ["Funktion", "Rörlighet", "Kontroll"];

// Antal övningar × en minut = programmets totala längd.
const exerciseCount = rehabExercises.length;

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <IconButton
          icon="ⓘ"
          ariaLabel="Om Svinont"
          onClick={() => setIsAboutOpen(true)}
        />
      </header>

      <div className={styles.hero}>
        <p className={styles.mark} aria-hidden="true">SO</p>

        <p className={styles.wordmark}>svinont</p>

        <ul className={styles.valueProps}>
          {valueProps.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>

      <div className={styles.summary}>
        <p className={styles.summaryLine}>{exerciseCount} övningar</p>
        <p className={styles.summaryLine}>{exerciseCount} minuter</p>
      </div>

      <PrimaryButton onClick={onStart}>Starta pass</PrimaryButton>

      <InstallPrompt />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
