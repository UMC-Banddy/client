import { proxy } from "valtio";

interface SurveyData {
  keywords: string[];
  artists: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
  genres: string[];
  sessions: string[];
  isCompleted: boolean;
}

interface SurveyState {
  surveyData: SurveyData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

const initialSurveyData: SurveyData = {
  keywords: [],
  artists: [],
  genres: [],
  sessions: [],
  isCompleted: false,
};

export const surveyStore = proxy<SurveyState>({
  surveyData: initialSurveyData,
  currentStep: 0,
  isLoading: false,
  error: null,
});

// Actions
export const surveyActions = {
  setKeywords: (keywords: string[]) => {
    surveyStore.surveyData.keywords = keywords;
  },

  setArtists: (artists: SurveyData["artists"]) => {
    surveyStore.surveyData.artists = artists;
  },

  setGenres: (genres: string[]) => {
    surveyStore.surveyData.genres = genres;
  },

  setSessions: (sessions: string[]) => {
    surveyStore.surveyData.sessions = sessions;
  },

  setCurrentStep: (currentStep: number) => {
    surveyStore.currentStep = currentStep;
  },

  setLoading: (isLoading: boolean) => {
    surveyStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    surveyStore.error = error;
  },

  resetSurvey: () => {
    surveyStore.surveyData = initialSurveyData;
    surveyStore.currentStep = 0;
    surveyStore.error = null;
  },

  markCompleted: () => {
    surveyStore.surveyData.isCompleted = true;
  },
};
