"use client";

import { ChannelProvider } from "ably/react";
import { User } from "@/generated/prisma";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState, startTransition } from "react";
import { MapPin, Calendar, Activity, Gavel, Share2 } from "lucide-react";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import Spinner, { DefaultLoader } from "@/components/Spinner";
import { InningDetails, MatchWithDetails, PlayerWithUser } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { addOfficials, startNextInning } from "@/actions/match-actions";
import { toast } from "sonner";
import InitializeMatchModal from "../_components/modals/InitializeMatchModal";
import { type MatchOfficial } from "../_types/types";
import { MatchHeroSection } from "../_components/MatchHeroSection";
import { OfficialsModal } from "../_components/modals/OfficialsModal";
import StartNextInningModal from "../_components/modals/StartNextInningModal";
import { LiveScorecard } from "../_components/LiveScorecard";
import { AwaitingCard } from "../_components/cards/AwaitingCard";
import { InfoCard } from "../_components/cards/InfoCard";
import { formatDate } from "@/utils/helper/formatDate";
interface MatchIdPageProps {}

const MatchIdPage = ({}: MatchIdPageProps) => {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { execute: executeAddOfficials } = useAction(addOfficials, {
    onSuccess(data) {
      toast.success("Officials Added");
      queryClient.invalidateQueries({ queryKey: ["match", id] });
      handleClose();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeStartNextInning, isLoading: startingNextInning } = useAction(
    startNextInning,
    {
      onSuccess() {
        toast.success("Match Started");

        startTransition(() => {
          router.refresh();
        });

        setIsInitializing(false);
      },

      onError(error) {
        toast.error(error);
      },
    }
  );
  const { data: match, isLoading } = useQuery<MatchWithDetails>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}`);

      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const { data: innings, isLoading: inningsLoading } = useQuery<InningDetails[]>({
    queryKey: ["match-innings", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}/innings`);

      if (!data.success) return [];

      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const { data: user } = useQuery<User>({
    queryKey: ["organizer", id],
    queryFn: async () => {
      const { data } = await axios.get("/api/me");

      return data.data;
    },
  });

  const [isInitializing, setIsInitializing] = useState(false);
  const [isStartingNextInning, setIsStartingNextInning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddOfficial = (matchOfficials: MatchOfficial[]) => {
    if (!match) return;

    executeAddOfficials({ matchId: match.id, matchOfficials });
  };

  const handleShare = async () => {
    const matchUrl = `${window.location.origin}/matches/${id}`;

    const shareData = {
      title: `${match?.teamA} vs ${match?.teamB}`,
      text: `🏏 ${match?.teamA} vs ${match?.teamB} is live now. Check the score!`,
      url: matchUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(matchUrl);
        alert("Match link copied!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNextInning = (strikerId: string, nonStrikerId: string, bowlerId: string) => {
    if (!match) return;

    executeStartNextInning({ bowlerId, matchId: match.id, nonStrikerId, strikerId });
  };

  const handleRestartMatch = () => {};

  const players: PlayerWithUser[] = useMemo(() => {
    const teamAPlayers = match?.teamA.players || [];
    const teamBPlayers = match?.teamB.players || [];

    const uniquePlayers = Array.from(
      new Map([...teamAPlayers, ...teamBPlayers].map((p) => [p.userId, p])).values()
    ).filter((pl) => !match?.matchOfficials.some((official) => official.userId === pl.userId));

    return uniquePlayers as PlayerWithUser[];
  }, [match]);

  const isOrganizer = useMemo(() => {
    return match?.organizerId === user?.id;
  }, [user, match]);

  return (
    <div className={`font-sans transition-colors duration-500`}>
      {isLoading ? (
        <DefaultLoader />
      ) : !match ? (
        <NotFoundParagraph
          redirect
          link="/matches"
          title="Match not found"
          description="This match is not available"
        />
      ) : (
        <ChannelProvider channelName={`match:${match.id}`}>
          <div className="min-h-screen bg-slate-50 pb-32 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
            {/* Hero Section */}

            <MatchHeroSection innings={innings} match={match} />

            <div className="flex flex-col items-center px-4">
              {/* Match Title & Actions */}
              <div className="w-full max-w-4xl text-center">
                <div className="center mb-4 flex flex-col text-3xl font-black tracking-tighter uppercase italic md:text-5xl">
                  <h1 className="text-start">{match.teamA.name}</h1>
                  <span className="primary-heading pr-2 text-center">vs</span>
                  <h1 className="text-end"> {match.teamB.name}</h1>
                </div>

                <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                  {isOrganizer ? (
                    <>
                      {match.requestStatus === "pending" ? (
                        <span className="border-input secondary-text rounded-2xl border bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest shadow-lg transition-all hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                          Request Pending
                        </span>
                      ) : match.status === "not_started" ? (
                        <button
                          onClick={() => setIsInitializing(true)}
                          className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                          Initialize Match
                        </button>
                      ) : match.status === "inning_completed" ? (
                        <button
                          onClick={() => setIsStartingNextInning(true)}
                          className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                          Start Inning
                        </button>
                      ) : (
                        match.status === "stopped" && (
                          <button
                            onClick={() => setIsInitializing(true)}
                            className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                          >
                            Resume
                          </button>
                        )
                      )}
                    </>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-[inter] text-xs font-semibold tracking-widest text-slate-900 shadow-lg transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                      {match.status === "not_started" && "Not started yet"}
                    </div>
                  )}
                  {match && (
                    <button
                      onClick={handleShare}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-400 shadow-lg transition-all hover:text-green-500 dark:border-white/10 dark:bg-slate-800"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 w-full space-y-12">
                <div className="space-y-12">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="flex items-center gap-3 font-[poppins] text-2xl font-black uppercase italic lg:text-3xl">
                      Match
                      <span className="primary-heading pr-2">Center</span>
                    </h3>
                    <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Powered by Scordo
                    </span>
                  </div>
                  {/* Scorecard */}
                  {match.status === "not_started" ? (
                    <AwaitingCard
                      title={"Awaiting Toss Results"}
                      description={
                        "The match engine is on standby. The live scoreboard and ball-by-ball feed will initialize once the 2nd inning is started."
                      }
                    />
                  ) : (
                    <LiveScorecard innings={innings} match={match} userId={user?.id} />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="flex items-center gap-3 font-[poppins] text-2xl font-black uppercase italic lg:text-3xl">
                      Match
                      <span className="primary-heading pr-2">Details</span>
                    </h3>
                    <div className="mx-6 h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="font-[urbanist] text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Powered by Scordo
                    </span>
                  </div>

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
                    <div
                      className="cursor-pointer"
                      onClick={handleOpen}
                      role="button"
                      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
                      tabIndex={0}
                    >
                      <InfoCard
                        label="Official Assigned"
                        value={`${match.matchOfficials.length} Officials`}
                        icon={Gavel}
                        color="green"
                        subValue={"See all officials list of the match"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OfficialsModal
            isOrganizer={isOrganizer}
            onSubmit={handleAddOfficial}
            players={players || []}
            isOpen={isOpen}
            officials={match?.matchOfficials || []}
            onClose={handleClose}
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
        </ChannelProvider>
      )}
    </div>
  );
};

export default MatchIdPage;
