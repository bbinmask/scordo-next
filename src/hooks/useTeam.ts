import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMyTeams = async () => {
  const { data } = await axios.get(`/api/team/my-teams`);
  return data;
};

export function useMyTeams() {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => fetchMyTeams(),
  });
}
