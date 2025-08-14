import { useQuery } from "@tanstack/react-query";
import { getArtistQuestion } from "@/store/artistApi";

export const useArtistQuestion = () => {
  return useQuery({
    queryKey: ["artistQuestion"],
    queryFn: getArtistQuestion,
  });
};
