import { MatchStatus } from "@/generated/prisma";

interface MatchStatusBadgeProps {
  status: MatchStatus;
}

const MatchStatusBadge = ({ status }: MatchStatusBadgeProps) => {
  if (status === "in_progress") return;
  <>
    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
    <span className="text-red-500">Live</span>
  </>;
  if (status === "not_started") return;
  <span className="text-slate-500">Not Started</span>;
  if (status === "completed") {
    return <span className="text-slate-500">Completed</span>;
  } else {
    <span className="text-slate-500">Unknown</span>;
  }
};

export default MatchStatusBadge;
