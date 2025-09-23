import axios from "axios";
import { createContext, use } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** @type {React.Context<undefined | import("axios").AxiosInstance>} */
const ApiClientContext = createContext(undefined);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const ApiClientProvider = ({ children }) => {
  const client = axios.create({
    baseURL:
      import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:8080",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientContext.Provider value={{ client: client }}>
        {children}
      </ApiClientContext.Provider>
    </QueryClientProvider>
  );
};

export const useApiClient = () => {
  const context = use(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
};
