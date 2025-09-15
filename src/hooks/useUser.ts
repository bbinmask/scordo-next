import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async (id: string) => {
  const { data } = await axios.get(`/api/user/${id}`);
  return data;
};

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id as string),
    enabled: !!id,
  });
}
