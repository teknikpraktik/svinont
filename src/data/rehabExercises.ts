import type { Exercise } from "@/types/workout";

// PLATSHÅLLARE. Det här är generiska, skonsamma rörlighets-/stabilitetsövningar
// – INTE en medicinsk ordination. Byt ut hela listan mot dina faktiska,
// ordinerade rehabövningar. Ordningen i listan är ordningen i passet, och varje
// övning körs i en minut (se lib/buildWorkout.ts).
//
// Enda kraven på en övning: unikt `id`, ett `name` och en `instruction`.
// Lägg till eller ta bort poster fritt – passet anpassar sig efter listans längd.
export const rehabExercises: Exercise[] = [
  {
    id: "neck-rotation",
    name: "Nackrotation",
    instruction:
      "Sitt eller stå avslappnat. Vrid huvudet långsamt åt sidan, tillbaka till mitten och åt andra hållet. Mjuka, kontrollerade rörelser.",
  },
  {
    id: "shoulder-rolls",
    name: "Axelrullningar",
    instruction:
      "Rulla axlarna bakåt i stora, lugna cirklar. Andas jämnt. Byt riktning efter halva tiden.",
  },
  {
    id: "cat-camel",
    name: "Katt och kamel",
    instruction:
      "På alla fyra: runda ryggen mot taket, sänk sedan mjukt till svank. Följ andningen i rörelsen.",
  },
  {
    id: "pelvic-tilt",
    name: "Bäckentippning",
    instruction:
      "Ligg på rygg med böjda knän. Tippa bäckenet så att ländryggen pressas mot golvet, släpp sedan. Små, kontrollerade rörelser.",
  },
  {
    id: "glute-bridge",
    name: "Höftlyft",
    instruction:
      "Ligg på rygg med böjda knän. Lyft höften till en rak linje från knä till axel, sänk kontrollerat.",
  },
  {
    id: "knee-to-chest",
    name: "Knä mot bröst",
    instruction:
      "Ligg på rygg. Dra ena knät mjukt mot bröstet och håll en kort stund, byt ben. Skonsam stretch i ländrygg och säte.",
  },
  {
    id: "ankle-pumps",
    name: "Fotpumpar",
    instruction:
      "Sitt eller ligg. För foten upp och ner i vristen i lugnt tempo. Håll rörelsen mjuk genom hela intervallet.",
  },
  {
    id: "wall-angels",
    name: "Väggänglar",
    instruction:
      "Stå med rygg och armar mot en vägg. För armarna långsamt upp och ner medan du håller kontakt mot väggen.",
  },
  {
    id: "standing-hip-abduction",
    name: "Höftabduktion stående",
    instruction:
      "Stå och håll i ett stöd. För ena benet rakt ut åt sidan och tillbaka, kontrollerat. Byt ben efter halva tiden.",
  },
  {
    id: "seated-forward-fold",
    name: "Sittande framåtfällning",
    instruction:
      "Sitt med benen fram. Fäll överkroppen mjukt framåt med rak rygg tills du känner en lätt stretch. Andas lugnt.",
  },
];
