import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { useHandleRequest } from "@/hooks/useTeam";
import TeamProps from "@/types/teams.props";
import NotFoundParagraph from "@/components/NotFoundParagraph";

export default function TeamRequests({
  team,
  setTeam,
}: {
  team: TeamProps;
  setTeam: React.Dispatch<React.SetStateAction<TeamProps | null>>;
}) {
  const { handleAcceptRequest, handleRejectRequest } = useHandleRequest();
}
