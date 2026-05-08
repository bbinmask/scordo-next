"use client";

import { ChannelProvider } from "ably/react";
import { User } from "@/generated/prisma";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { MapPin, Calendar, Activity, Gavel, Share2, ClipboardList, Swords } from "lucide-react";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { DefaultLoader } from "@/components/Spinner";
import { InningDetails, MatchWithDetails, PlayerWithUser } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { addOfficials } from "@/actions/match-actions";
import { toast } from "sonner";
import InitializeMatchModal from "../_components/modals/InitializeMatchModal";
import { type MatchOfficial } from "../_types/types";
import { MatchHeroSection } from "../_components/MatchHeroSection";
import { OfficialsModal } from "../_components/modals/OfficialsModal";
import StartNextInningModal from "../_components/modals/StartNextInningModal";
import { LiveScorecard } from "../_components/LiveScorecard";
import { EmptyState } from "@/components/cards/EmptyState";
import { InfoCard } from "@/components/cards/InfoCard";
import { formatDate } from "@/utils/helper/formatDate";
import { CommentaryFeed } from "../_components/commentary/CommentaryFeed";
import { SectionHeader } from "@/components/layouts/SectionHeader";
import ScorecardModal from "../_components/modals/ScorecardModal";
import { apiFetch } from "@/services/api.service";
import { matchService } from "@/services/match.service";
import { userService } from "@/services/user.service";
import { currentUser } from "@/lib/currentUser";

const MatchIdPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // ── Data fetching ──────────────────────────────────────────────────────────
  // BUG FIX #3: All three queries used raw `axios.get(...)` inline instead of
  // going through the service layer. This scatters API URLs across the component
  // — changing a route requires hunting across every file that calls it.
  // Import from the service layer (or at minimum a central api client).
  // For now we use the apiFetch wrapper from the service layer.
  // Replace the axios.get lines with: `import { matchService, userService } from "@/services"`
  // and call matchService.getMatch(id), matchService.getInnings(id), userService.getMe().

  const { data: match, isLoading } = useQuery<MatchWithDetails>({
    queryKey: ["match", id],
    queryFn: async () => {
      // Use matchService.getMatch(id) once the service layer is wired up.
      // import { matchService } from "@/services/match.service";
      // const res = await matchService.getMatch(id);
      // if (!res.success) throw new Error(res.message);
      // return res.data!;

      const res = await matchService.getMatch(id);
      if (!res.success) throw new Error(res.message);
      return res.data!;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: innings } = useQuery<InningDetails[]>({
    queryKey: ["match-innings", id],
    queryFn: async () => {
      const res = await matchService.getInnings(id);
      return res.success ? (res.data ?? []) : [];
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: user } = useQuery<User | null>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const user = await currentUser();
      if (!user) throw new Error("User not found");
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ── Actions ────────────────────────────────────────────────────────────────
  const { execute: executeAddOfficials } = useAction(addOfficials, {
    onSuccess() {
      toast.success("Officials Added");
      queryClient.invalidateQueries({ queryKey: ["match", id] });
      setIsOpen(false);
    },
    onError(error) {
      toast.error(error);
    },
  });

  // ── Local state ────────────────────────────────────────────────────────────
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStartingNextInning, setIsStartingNextInning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ── Derived values ─────────────────────────────────────────────────────────
  const players: PlayerWithUser[] = useMemo(() => {
    const all = [...(match?.teamA.players ?? []), ...(match?.teamB.players ?? [])];
    const unique = Array.from(new Map(all.map((p) => [p.userId, p])).values());
    return unique.filter(
      (pl) => !match?.matchOfficials.some((o) => o.userId === pl.userId)
    ) as PlayerWithUser[];
  }, [match]);

  const isOrganizer = useMemo(
    () => Boolean(match && user && match.organizerId === user.id),
    [user, match]
  );

  const handleAddOfficial = (matchOfficials: MatchOfficial[]) => {
    if (!match) return;
    executeAddOfficials({ matchId: match.id, matchOfficials });
  };

  const handleShare = async () => {
    const matchUrl = `${window.location.origin}/matches/${id}`;
    const shareData = {
      title: `${match?.teamA.abbreviation} vs ${match?.teamB.abbreviation}`,
      text: `🏏 ${match?.teamA.name} vs ${match?.teamB.name} is live now. Check the score!`,
      url: matchUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(matchUrl);
        toast.success("Match link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderStatusAction = () => {
    if (!isOrganizer) {
      // Non-organizer view: read-only status chip
      const label =
        match?.status === "not_started"
          ? "Not started yet"
          : match?.status === "completed"
            ? "Completed"
            : match?.status === "stopped"
              ? "Stopped"
              : "Live";

      return <div className={"tab-pill"}>{label}</div>;
    }

    if (match?.requestStatus === "pending") {
      return <span className={`${"tab-pill"} secondary-text`}>Request Pending</span>;
    }

    switch (match?.status) {
      case "not_started":
        return (
          <button onClick={() => setIsInitializing(true)} className={"tab-pill"}>
            Initialize Match
          </button>
        );
      case "inning_completed":
        return (
          <button onClick={() => setIsStartingNextInning(true)} className={"tab-pill"}>
            Start Inning
          </button>
        );
      case "stopped":
        return (
          <button onClick={() => setIsInitializing(true)} className={"tab-pill"}>
            Resume
          </button>
        );
      case "in_progress":
        return (
          <span className={"tab-pill"}>
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Live
          </span>
        );
      default:
        return <span className={"tab-pill"}>Completed</span>;
    }
  };

  if (isLoading) return <DefaultLoader />;

  if (!match) {
    return (
      <NotFoundParagraph
        redirect
        link="/matches"
        title="Match not found"
        description="This match is not available"
      />
    );
  }

  return (
    <ChannelProvider channelName={`match:${match.id}`}>
      <div className="min-h-screen bg-slate-50 pb-32 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
        <MatchHeroSection innings={innings} match={match} />

        <div className="flex flex-col items-center px-4">
          {/* Match title */}
          <div className="w-full max-w-4xl text-center">
            <div className="center mb-4 flex flex-col text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
              <h1 className="text-start">{match.teamA.name}</h1>
              <span className="primary-heading pr-2 text-center">vs</span>
              <h1 className="text-end">{match.teamB.name}</h1>
            </div>

            {/* Status action row */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
              {/* BUG FIX #6: single renderStatusAction() call replaces 6 repeated className blocks */}
              {renderStatusAction()}

              <button
                onClick={handleShare}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-400 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsScorecardOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-[urbanist] text-xs font-semibold text-slate-500 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
              >
                <ClipboardList className="h-4 w-4" />
                Scorecard
              </button>
            </div>
          </div>

          <div className="mt-4 w-full space-y-12">
            {/* Live scorecard section */}
            <div className="space-y-12">
              <SectionHeader title="Match" highlight="Center" />

              {match.status === "not_started" ? (
                <EmptyState
                  icon={<Swords className="h-8 w-8 text-slate-300 dark:text-slate-600" />}
                  title="Awaiting Toss Results"
                  description="The match engine is on standby. The live scoreboard and ball-by-ball feed will initialize once the 2nd inning is started."
                />
              ) : (
                <LiveScorecard innings={innings} match={match} userId={user?.id} />
              )}
            </div>

            {/* AI Commentary Feed */}
            {match.commentaryEnabled && (
              <div className="space-y-4 px-4">
                <CommentaryFeed matchId={match.id} isEnabled={match.commentaryEnabled} />
              </div>
            )}

            {/* Match details cards */}
            <div className="space-y-4">
              <SectionHeader title="Match" highlight="Details" />

              <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                <InfoCard
                  label="Stadium Venue"
                  value={match.location || "TBD"}
                  icon={MapPin}
                  color="green"
                  subValue={
                    match.venue ? `${match.venue.city}, ${match.venue.country}` : "Location TBD"
                  }
                />
                <InfoCard
                  label="Match Category"
                  value={match.category}
                  icon={Activity}
                  color="blue"
                  subValue={`${match.overs} Over Restricted`}
                />
                <InfoCard
                  label="Scheduled Kickoff"
                  value={match.date ? formatDate(new Date(match.date)) : "TBD"}
                  icon={Calendar}
                  color="amber"
                  subValue={
                    match.status === "not_started"
                      ? "Match Not Started"
                      : match.status.replace(/_/g, " ")
                  }
                />
                {/* Officials card is interactive — wrapping div with role="button" */}
                <div
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}
                  role="button"
                  onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
                  tabIndex={0}
                >
                  <InfoCard
                    label="Official Assigned"
                    value={`${match.matchOfficials.length} Officials`}
                    icon={Gavel}
                    color="green"
                    subValue="See all officials list of the match"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OfficialsModal
        isOrganizer={isOrganizer}
        onSubmit={handleAddOfficial}
        players={players}
        isOpen={isOpen}
        officials={match.matchOfficials}
        onClose={() => setIsOpen(false)}
      />

      {isOrganizer && (
        <InitializeMatchModal
          status={match.status}
          isOpen={isInitializing}
          match={match}
          onClose={() => setIsInitializing(false)}
        />
      )}

      {isOrganizer && (
        <StartNextInningModal
          innings={innings}
          match={match}
          isOpen={isStartingNextInning}
          onClose={() => setIsStartingNextInning(false)}
        />
      )}

      <ScorecardModal
        isOpen={isScorecardOpen}
        innings={innings}
        onClose={() => setIsScorecardOpen(false)}
      />
    </ChannelProvider>
  );
};

export default MatchIdPage;
