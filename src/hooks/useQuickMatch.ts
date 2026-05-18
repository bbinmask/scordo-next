"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getQuickMatch, saveQuickMatch } from "@/lib/match/quick-match-storage";
import {
  applyBall,
  undoLastBall,
  createEmptyInning,
  needsBowlerChange,
  bowlerOversBowled,
} from "@/lib/match/quick-engine";
import type { QuickMatch, QuickInning, QuickBallInput, QuickToss } from "@/types/quick-match.props";

export interface UseQuickMatchReturn {
  // Data
  match: QuickMatch | null;
  currentInning: QuickInning | null;
  isLoading: boolean;
  notFound: boolean;

  // Scoring
  scoreBall: (input: Omit<QuickBallInput, "matchId" | "inningId">) => void;
  undoBall: () => void;
  isSubmitting: boolean;

  // Match setup
  setToss: (toss: QuickToss) => void;
  initializeFirstInning: (params: {
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    battingTeamId: string;
    bowlingTeamId: string;
  }) => void;
  startNextInning: (params: { strikerId: string; nonStrikerId: string; bowlerId: string }) => void;

  // Bowler management
  changeBowler: (bowlerId: string) => void;
  needsBowlerChange: boolean;
  isOverFinished: boolean;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useQuickMatch(): UseQuickMatchReturn {
  const [match, setMatch] = useState<QuickMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOverFinished, setIsOverFinished] = useState(false);

  useEffect(() => {
    const stored = getQuickMatch();
    if (!stored) {
      setNotFound(true);
    } else {
      setMatch(stored);
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((updated: QuickMatch) => {
    saveQuickMatch(updated);
    setMatch(updated);
  }, []);

  // ── Derived state ────────────────────────────────────────────────────────
  const currentInning: QuickInning | null =
    match && match.innings.length > 0 ? (match.innings[match.innings.length - 1] ?? null) : null;

  const needsChange = currentInning
    ? needsBowlerChange(currentInning.balls_history, currentInning.currentBowlerId)
    : false;

  // ── Toss ─────────────────────────────────────────────────────────────────
  const setToss = useCallback(
    (toss: QuickToss) => {
      if (!match) return;
      persist({ ...match, toss });
    },
    [match, persist]
  );

  const initializeFirstInning = useCallback(
    ({
      strikerId,
      nonStrikerId,
      bowlerId,
      battingTeamId,
      bowlingTeamId,
    }: {
      strikerId: string;
      nonStrikerId: string;
      bowlerId: string;
      battingTeamId: string;
      bowlingTeamId: string;
    }) => {
      if (!match) return;

      const battingTeam = match.teamA.id === battingTeamId ? match.teamA : match.teamB;
      const bowlingTeam = match.teamA.id === bowlingTeamId ? match.teamA : match.teamB;

      // Build name maps for the engine
      const batNames: Record<string, string> = {};
      const bowlNames: Record<string, string> = {};
      battingTeam.players.forEach((p) => {
        batNames[p.id] = p.name;
      });
      bowlingTeam.players.forEach((p) => {
        bowlNames[p.id] = p.name;
      });

      const inning = createEmptyInning(
        match.id,
        1,
        battingTeamId,
        bowlingTeamId,
        battingTeam.players.map((p) => p.id),
        bowlingTeam.players.map((p) => p.id),
        batNames,
        bowlNames,
        strikerId,
        nonStrikerId,
        bowlerId
      );

      persist({
        ...match,
        status: "in_progress",
        innings: [inning],
      });
    },
    [match, persist]
  );

  // ── Start next inning ─────────────────────────────────────────────────────
  const startNextInning = useCallback(
    ({
      strikerId,
      nonStrikerId,
      bowlerId,
    }: {
      strikerId: string;
      nonStrikerId: string;
      bowlerId: string;
    }) => {
      if (!match || !currentInning) return;

      // Teams swap: whoever was bowling now bats and vice versa
      const battingTeamId = currentInning.bowlingTeamId;
      const bowlingTeamId = currentInning.battingTeamId;

      const battingTeam = match.teamA.id === battingTeamId ? match.teamA : match.teamB;
      const bowlingTeam = match.teamA.id === bowlingTeamId ? match.teamA : match.teamB;

      const batNames: Record<string, string> = {};
      const bowlNames: Record<string, string> = {};
      battingTeam.players.forEach((p) => {
        batNames[p.id] = p.name;
      });
      bowlingTeam.players.forEach((p) => {
        bowlNames[p.id] = p.name;
      });

      const newInning = createEmptyInning(
        match.id,
        2,
        battingTeamId,
        bowlingTeamId,
        battingTeam.players.map((p) => p.id),
        bowlingTeam.players.map((p) => p.id),
        batNames,
        bowlNames,
        strikerId,
        nonStrikerId,
        bowlerId
      );

      persist({
        ...match,
        status: "in_progress",
        innings: [...match.innings, newInning],
      });

      setIsOverFinished(false);
    },
    [match, currentInning, persist]
  );

  // ── Change bowler ─────────────────────────────────────────────────────────
  const changeBowler = useCallback(
    (bowlerId: string) => {
      if (!match || !currentInning) return;

      // Guard: bowler cannot bowl consecutive overs
      const lastLegal = [...currentInning.balls_history]
        .reverse()
        .find((b) => !b.isWide && !b.isNoBall);
      if (lastLegal?.bowlerId === bowlerId) {
        toast.error("A bowler cannot bowl consecutive overs");
        return;
      }

      // Guard: over limit
      const oversBowled = bowlerOversBowled(currentInning.balls_history, bowlerId);
      if (oversBowled >= match.overLimit) {
        toast.error("This bowler has completed all their overs");
        return;
      }

      const updatedInning: QuickInning = {
        ...currentInning,
        currentBowlerId: bowlerId,
      };

      const updatedInnings = match.innings.map((inn) =>
        inn.id === currentInning.id ? updatedInning : inn
      );

      persist({ ...match, innings: updatedInnings });
      setIsOverFinished(false);
    },
    [match, currentInning, persist]
  );

  // ── Score a ball ──────────────────────────────────────────────────────────
  const scoreBall = useCallback(
    (input: Omit<QuickBallInput, "matchId" | "inningId">) => {
      if (!match || !currentInning || isSubmitting) return;

      if (match.status !== "in_progress") {
        toast.success("Cannot update the score!");
        return;
      }

      setIsSubmitting(true);

      try {
        const fullInput: QuickBallInput = {
          ...input,
          matchId: match.id,
          inningId: currentInning.id,
        };

        const result = applyBall(currentInning, fullInput, match);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        const updatedInnings = match.innings.map((inn) =>
          inn.id === currentInning.id ? result.updatedInning : inn
        );

        let updatedMatch: QuickMatch = {
          ...match,
          innings: updatedInnings,
        };

        if (result.matchComplete) {
          updatedMatch = {
            ...updatedMatch,
            status: "completed",
            result: result.result,
            winnerId: result.winnerId,
          };
          toast.success(result.result ?? "Match Complete!");
        } else if (result.inngsComplete) {
          updatedMatch = { ...updatedMatch, status: "inning_completed" };
          toast.info("Innings complete! Start next innings.");
        }

        // Check if scorer needs to pick a new bowler after this ball
        const endOfOver = !input.isWide && !input.isNoBall && result.updatedInning.balls % 6 === 0;
        if (endOfOver && !result.inngsComplete && !result.matchComplete) {
          setIsOverFinished(true);
        }

        persist(updatedMatch);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "Failed to record ball");
      } finally {
        setIsSubmitting(false);
      }
    },
    [match, currentInning, isSubmitting, persist]
  );

  const undoBallFn = useCallback(() => {
    if (!match || !currentInning) return;

    const reverted = undoLastBall(currentInning);
    if (!reverted) {
      toast.error("No balls to undo");
      return;
    }
    const updatedInnings = match.innings.map((inn) =>
      inn.id === currentInning.id ? reverted : inn
    );

    // If match was completed, re-open it
    const newStatus =
      match.status === "completed" || match.status === "inning_completed"
        ? "in_progress"
        : match.status;

    persist({
      ...match,
      status: newStatus,
      result: newStatus === "in_progress" ? undefined : match.result,
      winnerId: newStatus === "in_progress" ? undefined : match.winnerId,
      innings: updatedInnings,
    });

    setIsOverFinished(false);
    toast.success("Last ball undone");
  }, [match, currentInning, persist]);

  return {
    match,
    currentInning,
    isLoading,
    notFound,
    scoreBall,
    undoBall: undoBallFn,
    isSubmitting,
    setToss,
    initializeFirstInning,
    startNextInning,
    changeBowler,
    needsBowlerChange: needsChange,
    isOverFinished,
  };
}
