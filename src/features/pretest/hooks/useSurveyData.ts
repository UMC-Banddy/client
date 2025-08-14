import { useMutation, useQuery } from "@tanstack/react-query";
import { surveyAPI, artistAPI } from "@/api/API";
import { surveyKeys } from "./keys";

export function useSurveySessions() {
  return useQuery({
    queryKey: surveyKeys.sessions(),
    queryFn: () => surveyAPI.getSessions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSurveyKeywords() {
  return useQuery({
    queryKey: surveyKeys.keywords(),
    queryFn: () => surveyAPI.getKeywords(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSurveyGenres() {
  return useQuery({
    queryKey: surveyKeys.genres(),
    queryFn: () => surveyAPI.getGenres(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchGenres(keyword: string) {
  return useQuery({
    queryKey: surveyKeys.genreSearch(keyword),
    queryFn: () => surveyAPI.searchGenres(keyword),
    enabled: keyword.trim().length > 0,
  });
}

export function useSearchArtists(keyword: string) {
  return useQuery({
    queryKey: surveyKeys.artistSearch(keyword),
    queryFn: () => artistAPI.searchArtists(keyword),
    enabled: keyword.trim().length > 0,
  });
}

export function useSubmitSurvey() {
  return useMutation({
    mutationFn: surveyAPI.submitSurvey,
  });
}

export function useSurveyArtists() {
  return useQuery({
    queryKey: ["survey", "artists"] as const,
    queryFn: () => artistAPI.getArtists(),
    staleTime: 5 * 60 * 1000,
  });
}
