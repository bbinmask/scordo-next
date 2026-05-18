# QUICK_MATCH_CHANGES.md

Complete documentation of the Quick Match system — every file created, every
pattern used, and how authenticated and guest matches share the same cricket engine.

---

## Files Created

### Types

| File                       | Purpose                                                                                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/quick-match.ts` | All Quick Match TypeScript interfaces — `QuickMatch`, `QuickTeam`, `QuickPlayer`, `QuickInning`, `QuickBall`, `QuickInningBatting`, `QuickInningBowling`, `QuickBallInput`, `CreateQuickMatchPayload` |

### Library

| File                             | Purpose                                                                                                                                                                                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/quick-match-storage.ts` | localStorage abstraction — `saveQuickMatch`, `getQuickMatch`, `getAllQuickMatches`, `updateQuickMatch`, `deleteQuickMatch`, `clearAllQuickMatches`. Handles SSR detection, `QuotaExceededError`, corrupted JSON, and schema versioning                                                              |
| `src/lib/cricket-engine.ts`      | **Pure cricket engine** — `applyBall`, `undoLastBall`, `computeTeamRuns`, `computeBatsmanRuns`, `computeBowlerRuns`, `computeNextStrike`, `needsBowlerChange`, `bowlerOversBowled`, `computeResult`, `createEmptyInning`. No Prisma, no React, no async. Used by both authenticated and guest paths |

### Hooks

| File                         | Purpose                                                                                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/hooks/useQuickMatch.ts` | Central React hook for a scoring session. Loads match from localStorage on mount, exposes `scoreBall`, `undoBall`, `changeBowler`, `initializeFirstInning`, `startNextInning`, `setToss`. Auto-persists every state change |

### Routes

| File                                                            | Purpose                                                                                                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(platform)/(root)/matches/quick-match/page.tsx`        | Landing page — feature explanation, CTA, how-it-works steps                                                                                                   |
| `src/app/(platform)/(root)/matches/quick-match/create/page.tsx` | Match creation form — team names, dynamic player fields, match settings, venue. On submit: generates `QuickMatch`, saves to localStorage, redirects to `[id]` |
| `src/app/(platform)/(root)/matches/quick-match/[id]/page.tsx`   | Main scoring page — loads match from localStorage, renders hero + scorecard + control pad + modals                                                            |

### Components

| File                                   | Purpose                                                                                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `_components/QuickHeroSection.tsx`     | Split-banner hero showing both teams and their scores. Mirrors `MatchHeroSection` but reads `QuickTeam`                                                                                          |
| `_components/QuickLiveScorecard.tsx`   | Live batting/bowling tables + run rate. Mirrors `LiveScorecard.tsx` layout precisely                                                                                                             |
| `_components/QuickControlPad.tsx`      | Scoring pad (0-6 buttons, WD/NB/B/LB toggles, Wicket). Thin adapter over `useQuickMatch.scoreBall` — reuses `WicketDetailsModal` and `SelectBowlerModal` from the authenticated system unchanged |
| `_components/QuickInitializeModal.tsx` | 2-step modal: toss → opening players. Guest equivalent of `InitializeMatchModal`                                                                                                                 |
| `_components/QuickNextInningModal.tsx` | Opening players for the 2nd innings. Mirrors `StartNextInningModal` without any API calls                                                                                                        |
| `_components/QuickScorecardModal.tsx`  | Full scorecard with batting/bowling tables, extras row, dismissal text, and match result. Mirrors `ScorecardModal` without the wickets API query                                                 |

---

## Architecture: How Authenticated and Quick Matches Share Logic

```
cricket-engine.ts          (pure functions — no dependencies)
     ↓                              ↓
pushBallHandler.ts          useQuickMatch.ts
(server action → Prisma)    (localStorage hook)
     ↓                              ↓
ControlPad.tsx              QuickControlPad.tsx
(calls server action)       (calls hook.scoreBall)
     ↓                              ↓
LiveScorecard.tsx           QuickLiveScorecard.tsx
(reads from API/TanStack)   (reads from hook state)
```

Every cricket rule lives **once** in `cricket-engine.ts`:

- Run accounting (team runs, batsman runs, bowler runs, Laws 21/24/25)
- Strike rotation (odd runs swap, end-of-over swap, wicket replacement)
- Ball/over counters (legal delivery detection)
- Bowler change guard (consecutive over detection)
- Over-limit guard
- End-of-innings detection
- Win/tie/draw result calculation (including T20 "Tied" vs Test "Drawn")
- Undo reversal (exact inverse of every mutation applyBall makes)

The authenticated `pushBallHandler` in `match-actions/index.ts` should eventually
call these pure functions for its calculations — at which point the rule lives
in exactly one place for both paths.

---

## localStorage Persistence

```
Key: "scordo_quick_matches"
Value: Record<matchId, QuickMatch>   (JSON stringified)
```

**Schema versioning**: every `QuickMatch` carries `version: 2`. The `readAll()`
function in `quick-match-storage.ts` silently skips entries whose version doesn't
match `CURRENT_VERSION`. When the schema changes, bump `CURRENT_VERSION` and add
a migration function before the version check.

**Error handling**:

- `JSON.parse` failure → returns empty Map (corrupted data, no crash)
- `localStorage.setItem` throws `QuotaExceededError` → logs to console, continues
- SSR (no `window`) → all functions are no-ops that return sensible defaults
- Private-mode localStorage blocked → detected by the `isAvailable()` test

**When persistence runs**: `useQuickMatch.persist()` is called synchronously
after every state mutation (`scoreBall`, `undoBall`, `changeBowler`,
`initializeFirstInning`, `startNextInning`, `setToss`). No debounce is needed
because mutations are discrete user actions (one per tap), not continuous streams.

---

## Data Flow: Scoring a Ball

```
User taps "4" on QuickControlPad
        ↓
QuickControlPad.submitBall(runs=4, wicket=null)
        ↓
useQuickMatch.scoreBall({ runs: 4, batsmanId, isWide: false, … })
        ↓
cricket-engine.applyBall(currentInning, input, match)
  → computeTeamRuns(4, false, false) = 4
  → computeBatsmanRuns(4, false, false) = 4
  → computeNextStrike(…)
  → creates QuickBall record
  → updates QuickInningBatting (runs, balls, fours)
  → updates QuickInningBowling (runs, balls)
  → advances inning counters (runs, balls, overs)
  → checks end-of-innings / match completion
  → returns { updatedInning, inngsComplete, matchComplete, result? }
        ↓
useQuickMatch builds updatedMatch
        ↓
saveQuickMatch(updatedMatch)   ← localStorage write
setMatch(updatedMatch)         ← React state update
        ↓
QuickLiveScorecard re-renders from new match state
```

---

## Reused Authenticated Components (unchanged)

These components from the authenticated system work in Quick Match without
modification because they accept generic prop shapes:

| Component                                 | Why it works                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `WicketDetailsModal`                      | Accepts `InningBattingDetails[]` and `InningBowlingDetails[]` — `QuickControlPad` builds minimal compatible objects |
| `SelectBowlerModal`                       | Only reads `playerId`, `playerName`, `overs` from the bowler list                                                   |
| `MatchStatusBadge`                        | Reads `status: string` — `QuickMatchStatus` values are identical strings                                            |
| `SectionHeader`                           | Pure presentational                                                                                                 |
| `EmptyState`                              | Pure presentational                                                                                                 |
| `NotFoundParagraph`                       | Pure presentational                                                                                                 |
| `formatDate`                              | Pure utility                                                                                                        |
| `getStrikeRate`, `getEcon`, `getRunRate`  | Pure utilities from `scorecard.ts`                                                                                  |
| `getBallLabel`, `getBallClassesFromLabel` | Pure utilities from `classes.ts`                                                                                    |

---

## Routes (No Auth Required)

All three routes are in the `(platform)/(root)` group but require **no Clerk
session**. No `currentUser()` call exists anywhere in the Quick Match path.
If the platform layout has an auth guard, add the quick-match paths to its
exclusion list (or move them to a separate route group).

```
/matches/quick-match          → landing page
/matches/quick-match/create   → form (no API calls)
/matches/quick-match/[id]     → scoring page (localStorage only)
```

---

## Future Improvements

1. **Share via URL** — encode the match ID in a shareable URL. The `[id]`
   page already uses the URL-based ID; sharing the URL lets someone bookmark it.
   True multi-device sharing would require an opt-in "save to cloud" flow using
   the existing Prisma backend.

2. **Pull authenticated engine into cricket-engine.ts** — `pushBallHandler`
   duplicates the run-accounting and strike-rotation logic. Refactor it to call
   `computeTeamRuns`, `computeBatsmanRuns`, etc. from `cricket-engine.ts`.

3. **IndexedDB for large matches** — `localStorage` has a 5 MB per-origin cap.
   A Test match with 900+ balls could approach this. Swap `quick-match-storage.ts`
   internals to use `idb-keyval` (a 600-byte IndexedDB wrapper) without changing
   any call sites.

4. **Match list page** — add `/matches/quick-match/history` that calls
   `getAllQuickMatches()` and lists all locally-stored matches with delete buttons.

5. **Commentary** — `cricket-engine.ts` returns the ball data needed by
   `generateCommentary`. Wire it in `useQuickMatch.scoreBall` (client-side only;
   the Anthropic API is already called from the browser in other artifact contexts).

6. **Offline PWA** — add a service worker to cache the quick-match routes so
   the app works with zero connectivity, not just no-API scoring.
