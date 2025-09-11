import { useContext } from "react";
import { LoadingContext, LoadingContextType } from "../contexts/LoadingContextValue";

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default useLoading;
