# Svinont

Systerapp till [Svinstark](../Svinstark) – samma design och samma passmotor
(timer, ljudsignaler, wake lock, passkärm), men en minimalistisk **rehabapp**:
öppna, tryck **Starta pass**, gör dagens rehab, klart. Inga val innan passet.

- Fast övningsbank på 14 rehabövningar för rygg och knä (`src/data/rehabExercises.ts`)
- Varje pass använder alla övningar, en gång var, i exakt en minut (≈14 min)
- Ordningen varieras enligt rehab-regler av passgeneratorn (`src/lib/buildWorkout.ts`)
- Inga val på startsidan – bara Starta pass

Passmotorn (`src/lib/timer.ts`, `src/hooks/*`, `TimerDisplay`, `ExerciseCard`
m.fl.) är kopierad oförändrad från Svinstark. Svinstarks slumpande styrke-
generator är ersatt med en regelstyrd rehab-generator i `src/lib/buildWorkout.ts`.

## Passgeneratorn

Alla 14 övningar är alltid med – det som varierar är ordningen. Generatorn
väljer en ordning som:

- inte har två tunga knäövningar i rad,
- inte har tre ryggövningar i rad,
- har minst en stabilitetsövning i vardera passhalvan,
- inte upprepar exakt samma ordning som föregående pass,
- och växlar mellan rygg- och knäfokus så mycket som möjligt.

## Kör lokalt

```bash
npm install
npm run dev
```

## Att göra

- **Justera övningarna** i `src/data/rehabExercises.ts` efter det som är
  ordinerat för dig. De som ligger där nu är generiska rehabövningar, inte en
  medicinsk ordination.
