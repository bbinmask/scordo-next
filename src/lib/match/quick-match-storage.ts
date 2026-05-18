import { STORAGE_KEY } from "@/constants";
import type { QuickMatch } from "@/types/quick-match.props";

function isAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return true;
}

function getMatch(): QuickMatch | null {
  if (!isAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsedMatch = JSON.parse(raw) as QuickMatch;

    return parsedMatch;
  } catch {
    return null;
  }
}

function pushMatchToLocalStorage(match: QuickMatch): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
  } catch (err) {
    console.error("[QuickMatchStorage] Failed to persist:", err);
  }
}

export function saveQuickMatch(match: QuickMatch): void {
  pushMatchToLocalStorage(match);
}

export function getQuickMatch(): QuickMatch | null {
  return getMatch() ?? null;
}

export function updateQuickMatch(patch: Partial<QuickMatch>): QuickMatch | null {
  const match = getMatch();
  if (!match) return null;

  const updated = { ...match, ...patch, updatedAt: new Date().toISOString() };
  pushMatchToLocalStorage(updated);
  return updated;
}

export function deleteQuickMatch(): boolean {
  clearAllQuickMatches();

  return true;
}

export function clearAllQuickMatches(): void {
  if (!isAvailable()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
