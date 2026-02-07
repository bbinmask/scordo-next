import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ball, WicketType } from "@/generated/prisma";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface WicketDetails {
  primary?: string; // e.g., Fielder name
  secondary?: string; // e.g., Thrown by
}

interface WicketConfig {
  id: string;
  label: string;
  icon: string;
  fields: {
    key: keyof WicketDetails;
    label: string;
    placeholder: string;
  }[];
}

const WICKET_CONFIGS: WicketConfig[] = [
  { id: "bowled", label: "Bowled", icon: "🏏", fields: [] },
  {
    id: "caught",
    label: "Caught",
    icon: "🖐️",
    fields: [{ key: "primary", label: "Caught by", placeholder: "Fielder name" }],
  },
  { id: "lbw", label: "LBW", icon: "🦵", fields: [] },
  {
    id: "runout",
    label: "Run Out",
    icon: "🏃",
    fields: [
      { key: "primary", label: "Player Out", placeholder: "Batsman name" },
      { key: "secondary", label: "Thrown by", placeholder: "Fielder name" },
    ],
  },
  {
    id: "stumped",
    label: "Stumped",
    icon: "🧤",
    fields: [{ key: "primary", label: "Wicketkeeper", placeholder: "Keeper name" }],
  },
  { id: "hitwicket", label: "Hit Wicket", icon: "💥", fields: [] },
];

interface WicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Ball>) => void;
  pendingRuns: number;
}

export const WicketDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
  pendingRuns,
}: WicketDetailsModalProps) => {
  const [step, setStep] = useState<"type" | "fields">("type");
  const [selectedConfig, setSelectedConfig] = useState<WicketConfig | null>(null);
  const [formData, setFormData] = useState<WicketDetails>({ primary: "", secondary: "" });

  useEffect(() => {
    if (isOpen) {
      setStep("type");
      setSelectedConfig(null);
      setFormData({ primary: "", secondary: "" });
    }
  }, [isOpen]);

  const handleTypeSelect = (config: WicketConfig) => {
    setSelectedConfig(config);
    if (config.fields.length > 0) {
      setStep("fields");
    } else {
      onConfirm({ dismissalType: config.label as WicketType });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-in slide-in-from-bottom-8 space-y-6 rounded-[2rem] duration-300">
        {/* Header */}
        <DialogHeader className="flex flex-col items-center justify-start">
          <DialogTitle>
            {step === "fields" && (
              <button
                onClick={() => setStep("type")}
                className="mb-1 flex items-center gap-1 text-[10px] font-bold tracking-widest text-indigo-500 uppercase"
              >
                <ArrowLeft size={12} /> Back
              </button>
            )}
            <h3 className="text-2xl font-black tracking-tight italic">
              {step === "type" ? "Dismissal Type" : `${selectedConfig?.label} Details`}
            </h3>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {/* Content */}
        <div className="max-h-[280px]">
          {step === "type" ? (
            <div className="grid grid-cols-2 gap-3">
              {WICKET_CONFIGS.map((config) => (
                <button
                  key={config.id}
                  onClick={() => handleTypeSelect(config)}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-slate-700 transition-all hover:border-green-500 hover:bg-green-500/70 hover:text-white"
                >
                  <span className="text-sm font-bold">{config.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedConfig?.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      autoFocus={field.key === "primary"}
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-700 transition-all outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => onConfirm({ dismissalType: selectedConfig?.label as WicketType })}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 font-black tracking-widest text-white uppercase transition-colors hover:bg-black"
              >
                Confirm Wicket <CheckCircle2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Status bar inside modal */}
        <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white italic">
            {pendingRuns}
          </div>
          <p className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
            Runs recorded on this delivery
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WicketDetailsModal;
