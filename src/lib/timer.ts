import type { TimerState, Workout, WorkoutBlock } from "@/types/workout";

const TICK_INTERVAL_MS = 250;

export interface ExerciseProgress {
  current: number;
  total: number;
}

// Vilken övning det aktuella blocket är, av det totala antalet övningar i
// passet (varje block i ett pass är en övning).
export function getExerciseProgress(
  blocks: WorkoutBlock[],
  currentBlockIndex: number
): ExerciseProgress {
  return { current: currentBlockIndex + 1, total: blocks.length };
}

export interface WorkoutTimerCallbacks {
  onTick?: (state: TimerState) => void;
  // Signaleras när ett block faktiskt börjar räkna: vid startNextBlock().
  onBlockChange?: (blockIndex: number) => void;
  onCountdown?: (remainingSeconds: number) => void;
  // Signaleras en gång per block när halva blocktiden passerats (30 s kvar
  // vid 60-sekundersblock). Används som sidbytes-/halvtidsmarkering.
  onHalfway?: (blockIndex: number) => void;
  onFinish?: () => void;
}

// Timern arbetar endast med ett Workout (02-teknisk-specifikation.md B.25) och
// känner inte till React. Den räknar mot en absolut deadline (Date.now()-baserad)
// istället för att bara räkna ned steg för steg, så att korrekt återstående tid
// bevaras även om appen hamnar i bakgrunden och intervallet fördröjs (D.11).
export class WorkoutTimer {
  private readonly blockDurationsSeconds: number[];
  private readonly callbacks: WorkoutTimerCallbacks;
  private state: TimerState;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private blockDeadline = 0;
  private remainingMsWhenPaused = 0;
  private halfwayFired = false;

  constructor(workout: Workout, callbacks: WorkoutTimerCallbacks = {}) {
    this.blockDurationsSeconds = workout.blocks.map((block) => block.duration);
    this.callbacks = callbacks;
    this.state = {
      currentBlock: 0,
      remainingSeconds: this.blockDurationsSeconds[0] ?? 0,
      isRunning: false,
      isPaused: false,
      isAwaitingNext: false,
    };
  }

  getState(): TimerState {
    return { ...this.state };
  }

  // "Armerar" timern: ställer den i väntläge på första övningen. Klockan
  // startar först när användaren trycker igång övningen (startNextBlock) -
  // samma flöde som mellan alla andra övningar.
  start(): void {
    if (this.state.isRunning || this.state.isAwaitingNext || this.blockDurationsSeconds.length === 0) return;

    this.enterAwaitNext(0);
  }

  pause(): void {
    if (!this.state.isRunning) return;

    this.remainingMsWhenPaused = Math.max(0, this.blockDeadline - Date.now());
    this.stopTicking();
    this.state = {
      ...this.state,
      isRunning: false,
      isPaused: true,
      remainingSeconds: Math.ceil(this.remainingMsWhenPaused / 1000),
    };
    this.emit();
  }

  resume(): void {
    if (!this.state.isPaused) return;

    this.blockDeadline = Date.now() + this.remainingMsWhenPaused;
    this.state = { ...this.state, isRunning: true, isPaused: false };
    this.beginTicking();
    this.emit();
  }

  stop(): void {
    this.stopTicking();
    this.state = { ...this.state, isRunning: false, isPaused: false, isAwaitingNext: false };
    this.emit();
  }

  // Hoppar över den aktuella övningen: går till väntläget inför nästa övning
  // (samma läge som när en övning löper ut), eller avslutar passet om det var
  // sista övningen. Fungerar både under pågående övning och i väntläget
  // (då hoppas den väntande övningen över).
  skip(): void {
    if (!this.state.isRunning && !this.state.isAwaitingNext) return;

    const isLastBlock = this.state.currentBlock >= this.blockDurationsSeconds.length - 1;
    if (isLastBlock) {
      this.stopTicking();
      this.state = {
        ...this.state,
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false,
        isAwaitingNext: false,
      };
      this.emit();
      this.callbacks.onFinish?.();
      return;
    }

    this.enterAwaitNext(this.state.currentBlock + 1);
  }

  // Startar den väntande övningen. Blocket får hela sin tid räknat från detta
  // ögonblick - det är hela poängen med väntläget: användaren väljer själv
  // när nästa övning ska börja.
  startNextBlock(): void {
    if (!this.state.isAwaitingNext) return;

    this.blockDeadline = Date.now() + this.blockDurationsSeconds[this.state.currentBlock] * 1000;
    this.state = { ...this.state, isRunning: true, isAwaitingNext: false };
    this.beginTicking();
    this.emit();
    this.callbacks.onBlockChange?.(this.state.currentBlock);
  }

  // Ställer timern i väntläge inför ett kommande block: blocket är valt och
  // visas med full tid, men klockan står stilla tills startNextBlock().
  private enterAwaitNext(blockIndex: number): void {
    this.stopTicking();
    this.halfwayFired = false;
    this.state = {
      ...this.state,
      currentBlock: blockIndex,
      remainingSeconds: this.blockDurationsSeconds[blockIndex],
      isRunning: false,
      isPaused: false,
      isAwaitingNext: true,
    };
    this.emit();
  }

  private beginTicking(): void {
    this.stopTicking();
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS);
  }

  private stopTicking(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    const remainingMs = this.blockDeadline - Date.now();

    // Blocket är slut. Sista blocket avslutar passet; annars väntläge tills
    // användaren själv startar nästa övning. (Ingen wall-clock-katch-up
    // längre: en bakgrundad flik landar som mest ett block framåt, i vila.)
    if (remainingMs <= 0) {
      const isLastBlock = this.state.currentBlock >= this.blockDurationsSeconds.length - 1;
      if (isLastBlock) {
        this.stopTicking();
        this.state = {
          ...this.state,
          remainingSeconds: 0,
          isRunning: false,
          isPaused: false,
          isAwaitingNext: false,
        };
        this.emit();
        this.callbacks.onFinish?.();
        return;
      }

      this.enterAwaitNext(this.state.currentBlock + 1);
      return;
    }

    // TICK_INTERVAL_MS är tätare än en hel sekund (för precision kring
    // block-/nedräkningsgränser), men det visade värdet är avrundat till hela
    // sekunder. Uppdatera state (och trigga en rendering) bara när det visade
    // värdet faktiskt ändras, för att undvika onödiga renderingar (A.10/C.29).
    const previousSeconds = this.state.remainingSeconds;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    if (remainingSeconds === previousSeconds) return;

    this.state = { ...this.state, remainingSeconds };

    // Halvtidssignal: signaleras exakt en gång per block, när återstående tid
    // passerar halva blocktiden. Flaggan (i stället för en exakt jämförelse
    // med halvtidssekunden) gör att signalen inte tappas bort om en bakgrundad
    // flik hoppar över just det sekundvärdet.
    const halfwaySeconds = Math.floor(this.blockDurationsSeconds[this.state.currentBlock] / 2);
    if (!this.halfwayFired && remainingSeconds <= halfwaySeconds && remainingSeconds > 0) {
      this.halfwayFired = true;
      this.callbacks.onHalfway?.(this.state.currentBlock);
    }

    // Normalt minskar remainingSeconds med exakt 1 per tick (250 ms-
    // intervallet är fyra gånger tätare än en sekund), men en bakgrundad
    // flik eller en fördröjd tick (t.ex. vid tunga renderingar) kan hoppa
    // över ett eller flera sekundvärden. Utan den här loopen kunde en sådan
    // hopp tysta ett eller flera av 3-2-1-pipen helt - de spelas nu upp i
    // snabb följd istället för att tappas bort.
    for (let second = Math.min(previousSeconds - 1, 3); second >= Math.max(remainingSeconds, 1); second--) {
      this.callbacks.onCountdown?.(second);
    }
    this.emit();
  }

  private emit(): void {
    this.callbacks.onTick?.(this.getState());
  }
}
