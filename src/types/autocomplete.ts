export interface AutocompleteResult {
  results: string[];
}

export interface AutocompleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AutocompleteResult;
} 