# Svinont

Systerapp till [Svinstark](../Svinstark) – samma design och samma passmotor
(timer, ljudsignaler, wake lock, passkärm), men enklare: ett **fast program**
av rehabövningar i stället för ett slumpat styrkepass.

- Fast lista på ca 10 rehabövningar (`src/data/rehabExercises.ts`)
- Varje övning körs i exakt en minut
- Inga val på startsidan – bara STARTA

Passmotorn (`src/lib/timer.ts`, `src/hooks/*`, `TimerDisplay`, `ExerciseCard`
m.fl.) är kopierad oförändrad från Svinstark. Den slumpande generatorn är
ersatt med `src/lib/buildWorkout.ts`, som bara mappar den fasta övningslistan
till 60-sekundersblock.

## Kör lokalt

```bash
npm install
npm run dev
```

## Att göra

- **Byt ut övningarna** i `src/data/rehabExercises.ts` mot dina faktiska,
  ordinerade rehabövningar. De som ligger där nu är generiska platshållare.
- Ersätt platshållar-ikonerna i `public/icons/` och `public/og-image.png`
  (kopior från Svinstark – visar fortfarande SS-märket).
