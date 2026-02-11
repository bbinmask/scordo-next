import NotFoundParagraph from "@/components/NotFoundParagraph";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ball, WicketType } from "@/generated/prisma";
import {
  InningBattingDetails,
  InningBowlingDetails,
  InningDetails,
  PlayerWithUser,
} from "@/lib/types";
import { ArrowLeft, Check, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface WicketDetails {
  primary?: string; // e.g., Fielder name
  secondary?: string; // e.g., Thrown by
}

interface WicketConfig {
  id: WicketType;
  label: string;
  icon: string;
  fields: {
    key: keyof WicketDetails;
    label: string;
    placeholder: string;
  }[];
}

const WICKET_CONFIGS: WicketConfig[] = [
  { id: "BOWLED", label: "Bowled", icon: "🏏", fields: [] },
  {
    id: "CAUGHT",
    label: "Caught",
    icon: "🖐️",
    fields: [{ key: "primary", label: "Caught by", placeholder: "Fielder name" }],
  },
  { id: "LBW", label: "LBW", icon: "🦵", fields: [] },
  {
    id: "RUN_OUT",
    label: "Run Out",
    icon: "🏃",
    fields: [{ key: "secondary", label: "Thrown by", placeholder: "Fielder name" }],
  },
  {
    id: "STUMPED",
    label: "Stumped",
    icon: "🧤",
    fields: [{ key: "primary", label: "Wicketkeeper", placeholder: "Keeper name" }],
  },
  { id: "HIT_WICKET", label: "Hit Wicket", icon: "💥", fields: [] },
];

interface WicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    runs: number,
    wicket?: {
      fielderId: string;
      batsmanId: string;
      nextBatsmanId: string;
      type: WicketType;
    }
  ) => void;
  batsmanOnCrease: InningBattingDetails[];
  battingPlayers: InningBattingDetails[];
  isSubmitting: boolean;
  fielders: InningBowlingDetails[];
}

export const WicketDetailsModal = ({
  isOpen,
  battingPlayers,
  onClose,
  onConfirm,
  isSubmitting,
  fielders,
  batsmanOnCrease,
}: WicketDetailsModalProps) => {
  const [step, setStep] = useState<"type" | "fields" | "next">("type");
  const [selectedConfig, setSelectedConfig] = useState<WicketConfig>();
  const [runs, setRuns] = useState(0);
  const [selectedFielderID, setSelectedFielderID] = useState<string>("");
  const [selectedBatsmanId, setSelectedBatsmanId] = useState<string>("");
  const [selectedNextBatsmanId, setSelectedNextBatsmanId] = useState<string>("");

  const handleTypeSelect = (config: WicketConfig) => {
    setSelectedConfig(config);

    if (config.fields.length === 0 || step === "fields") {
      setStep("next");
    } else {
      setStep("fields");
    }
  };

  const handleDone = () => {
    onConfirm(runs, {
      nextBatsmanId: selectedNextBatsmanId,
      fielderId: selectedFielderID,
      batsmanId: selectedBatsmanId,
      type: selectedConfig?.id as WicketType,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-in slide-in-from-bottom-8 space-y-6 rounded-[2rem] duration-300">
        {/* Header */}
        <DialogHeader className="flex items-center justify-start">
          <DialogTitle className="text-2xl font-black tracking-tight italic">
            {step === "type"
              ? "Dismissal Type"
              : step === "next"
                ? "Select Next Batsman"
                : `${selectedConfig?.label} Details`}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {/* Content */}
        <div className="max-h-[280px] overflow-y-auto">
          {step === "type" && (
            <div className="grid grid-cols-2 gap-3">
              {WICKET_CONFIGS.map((config) => (
                <button
                  key={config.id}
                  onClick={() => handleTypeSelect(config)}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 font-[inter] text-slate-900 transition-all hover:border-green-500 hover:bg-green-500/10 hover:text-green-600"
                >
                  <span className="text-xs font-bold">{config.label}</span>
                </button>
              ))}
            </div>
          )}
          {step === "fields" && (
            <div className="space-y-4">
              {selectedConfig?.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    {field.label}
                  </label>
                  <div className="relative grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
                    {fielders.map((fielder) => (
                      <button
                        key={fielder.playerId}
                        type="button"
                        onClick={() => setSelectedFielderID(fielder.playerId)}
                        className={`flex w-full items-center justify-between overflow-x-hidden rounded-xl border p-3 text-left transition-all ${
                          selectedFielderID === fielder.playerId
                            ? "border-teal-500 bg-teal-500/10 text-teal-600"
                            : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                        }`}
                      >
                        <span className="truncate text-[10px] font-bold uppercase">
                          {fielder.player.user.name}
                        </span>
                        {selectedFielderID === fielder.playerId && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {selectedConfig?.id === "RUN_OUT" && (
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    Player Out
                  </label>
                  <div className="relative grid max-h-48 grid-cols-2 gap-2">
                    {batsmanOnCrease.map((batsman) => (
                      <button
                        key={batsman.id}
                        type="button"
                        onClick={() => setSelectedBatsmanId(batsman.playerId)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                          selectedBatsmanId === batsman.playerId
                            ? "border-teal-500 bg-teal-500/10 text-teal-600"
                            : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                        }`}
                      >
                        <span className="truncate text-[10px] font-bold uppercase">
                          {batsman.player.user.name}
                        </span>
                        {selectedBatsmanId === batsman.playerId && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                  <label className="ml-1 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    Runs
                  </label>
                  <div className="center relative flex w-full gap-2">
                    {[0, 1, 2, 3, 4, 6].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRuns(val)}
                        className={`relative aspect-square h-14 rounded-2xl p-4 text-center font-[inter] text-lg font-bold transition-colors ease-in-out ${runs === val ? "bg-green-700 shadow-md" : "bg-slate-200 dark:bg-slate-600"}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {step === "next" && (
            <div className="custom-scrollbar max-h-64 space-y-1 overflow-y-auto pr-2">
              {battingPlayers.length === 0 ? (
                <NotFoundParagraph description="No players left" />
              ) : (
                battingPlayers.map((batsman) => (
                  <button
                    key={batsman.id}
                    type="button"
                    onClick={() => setSelectedNextBatsmanId(batsman.playerId)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      selectedNextBatsmanId === batsman.playerId
                        ? "border-teal-500 bg-teal-500/10 text-teal-600"
                        : "border-slate-100 bg-slate-50 text-slate-400 dark:border-white/5 dark:bg-white/5"
                    }`}
                  >
                    <span className="truncate text-[10px] font-bold uppercase">
                      {batsman.player.user.name}
                    </span>
                    {selectedNextBatsmanId === batsman.playerId && <Check className="h-3 w-3" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Status bar inside modal */}
        {step !== "type" && (
          <div className="grid grid-cols-2 items-center justify-between gap-2 py-2">
            <button
              onClick={() =>
                setStep((prev) =>
                  prev === "next" && selectedConfig?.fields.length === 0
                    ? "type"
                    : prev === "fields"
                      ? "type"
                      : "fields"
                )
              }
              type="button"
              className="group center flex w-full gap-1 rounded-2xl bg-slate-300 px-6 py-4 text-center font-[urbanist] text-xs font-bold uppercase transition-all dark:bg-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-2" />
              Back
            </button>
            {step === "fields" ? (
              <button
                onClick={() => setStep("next")}
                className="center group primary-btn flex gap-2 rounded-2xl px-12 py-4 text-center text-xs tracking-wide uppercase shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleDone}
                className="center group primary-btn flex gap-2 rounded-2xl px-12 py-4 text-center text-xs tracking-wide uppercase shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Loading..." : "Save"}
                {!isSubmitting && (
                  <ChevronRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
                )}
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WicketDetailsModal;
