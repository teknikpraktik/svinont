"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "svinont:settings";

// Svinont har inga passval (fast program) - enda inställningen är ljud på/av.
export interface RehabSettings {
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: RehabSettings = {
  soundEnabled: true,
};

let cachedSettings: RehabSettings = DEFAULT_SETTINGS;
let hasReadFromStorage = false;
const listeners = new Set<() => void>();

function sanitizeStoredSettings(parsed: Partial<Record<keyof RehabSettings, unknown>>): RehabSettings {
  return {
    soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
  };
}

function readFromStorage(): RehabSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    return sanitizeStoredSettings(JSON.parse(raw) as Partial<Record<keyof RehabSettings, unknown>>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getSnapshot(): RehabSettings {
  if (!hasReadFromStorage) {
    cachedSettings = readFromStorage();
    hasReadFromStorage = true;
  }
  return cachedSettings;
}

function getServerSnapshot(): RehabSettings {
  return DEFAULT_SETTINGS;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function setStoredSettings(next: RehabSettings): void {
  cachedSettings = next;
  hasReadFromStorage = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

// useSyncExternalStore läser localStorage utan hydreringskrock mot
// serverrendering (server får alltid DEFAULT_SETTINGS).
export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    settings,
    setSoundEnabled: (soundEnabled: boolean) => setStoredSettings({ ...settings, soundEnabled }),
  };
}
