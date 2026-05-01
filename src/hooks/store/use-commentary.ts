import { create } from "zustand";
import { CommentaryLine, CommentaryPayload } from "@/lib/commentary/engine";
import { nanoid } from "nanoid";

interface CommentaryStore {
  // Whether AI commentary is enabled for this match session
  isEnabled: boolean;
  enableCommentary: () => void;
  disableCommentary: () => void;

  // Whether the "enable commentary" prompt modal has been shown
  hasPrompted: boolean;
  setHasPrompted: () => void;

  // Live commentary feed — latest first
  lines: CommentaryLine[];
  isGenerating: boolean;

  // Keys seen (dedupe milestones/special events)
  seenKeys: Set<string>;

  // Add a generated line
  addLine: (commentary: CommentaryLine, payload: CommentaryPayload) => void;
  setGenerating: (v: boolean) => void;

  // Check + mark a dedupe key
  hasSeenKey: (key: string) => boolean;
  markKey: (key: string) => void;

  // Clear feed (new match)
  reset: () => void;
}

export const useCommentaryStore = create<CommentaryStore>((set, get) => ({
  isEnabled: false,
  hasPrompted: false,
  lines: [],
  isGenerating: false,
  seenKeys: new Set(),

  enableCommentary: () => set({ isEnabled: true }),
  disableCommentary: () => set({ isEnabled: false }),
  setHasPrompted: () => set({ hasPrompted: true }),

  addLine: (commentary, payload) =>
    set((s) => ({
      lines: [
        {
          id: nanoid(),
          text: commentary.text,
          label: commentary.label,
          eventType: payload.eventType,
          timestamp: new Date(),
          payload,
        },
        ...s.lines,
      ].slice(0, 50), // keep last 50 lines
    })),

  setGenerating: (v) => set({ isGenerating: v }),

  hasSeenKey: (key) => get().seenKeys.has(key),
  markKey: (key) =>
    set((s) => {
      const next = new Set(s.seenKeys);
      next.add(key);
      return { seenKeys: next };
    }),

  reset: () => set({ lines: [], seenKeys: new Set(), isGenerating: false }),
}));
