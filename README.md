# Svinont

Systerapp till [Svinstark](../Svinstark) – samma design och samma passmotor
(timer, ljudsignaler, wake lock, passkärm), men en minimalistisk **rehabapp**:
öppna, tryck **Starta pass**, gör dagens rehab, klart. Inga val innan passet.

- Fast övningsbank på 14 rehabövningar – 7 för knä, 7 för bröstrygg
  (`src/data/rehabExercises.ts`)
- Varje pass använder alla övningar, en gång var, i exakt en minut (≈14 min)
- Ordningen varieras av passgeneratorn (`src/lib/buildWorkout.ts`)
- Inga val på startsidan – bara Starta pass

Passmotorn (`src/lib/timer.ts`, `src/hooks/*`, `TimerDisplay`, `ExerciseCard`
m.fl.) kommer från Svinstark, utökad med halvtidssignal och manuell start av
nästa övning.

## Passgeneratorn

Alla 14 övningar är alltid med – det som varierar är ordningen:

- strikt varannan knä- och varannan bröstryggsövning,
- slumpad startövning och slumpad ordning inom varje grupp,
- aldrig exakt samma ordning som föregående pass.

## Under passet

- Ett pip vid halvtid (30 s kvar) - t.ex. som sidbytesmarkering.
- Nedräkningspip vid 3-2-1 och en startsignal när en övning börjar.
- Under de sista 10 sekunderna visas "Nästa övning: …".
- När en övning är klar väntar appen: nästa övning visas med full tid och
  startar först när användaren trycker på Starta.

## Kör lokalt

```bash
npm install
npm run dev
```

## Att göra

- **Justera övningarna** i `src/data/rehabExercises.ts` efter det som är
  ordinerat för dig. De som ligger där nu är generiska rehabövningar, inte en
  medicinsk ordination.
