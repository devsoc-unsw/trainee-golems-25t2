import { createContext } from "react";

export interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
