import axios from "axios";
import { createContext, use } from "react";

/** @type {React.Context<undefined | import("axios").AxiosInstance>} */
const ApiClientContext = createContext(undefined);

export const ApiClientProvider = ({ children }) => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
  });

  return (
    <>
      <ApiClientContext.Provider value={{ client: client }}>
        {children}
      </ApiClientContext.Provider>
    </>
  );
};

export const useApiClient = () => {
  const context = use(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
};
