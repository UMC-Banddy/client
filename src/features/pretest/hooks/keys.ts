export const surveyKeys = {
  root: ["survey"] as const,
  sessions: () => [...surveyKeys.root, "sessions"] as const,
  keywords: () => [...surveyKeys.root, "keywords"] as const,
  genres: () => [...surveyKeys.root, "genres"] as const,
  genreSearch: (keyword: string) =>
    [...surveyKeys.root, "genres", "search", keyword] as const,
  artistSearch: (keyword: string) =>
    [...surveyKeys.root, "artists", "search", keyword] as const,
};
