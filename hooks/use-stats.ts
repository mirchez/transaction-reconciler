import { useQuery } from "@tanstack/react-query";

interface StatsData {
  matched: number;
  ledgerOnly: number;
  bankOnly: number;
}

export function useStats() {
  return useQuery<StatsData>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      
      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content type:", contentType);
        throw new Error("Invalid response format");
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      
      return response.json();
    },
    // Refetch every 30 seconds
    refetchInterval: 30000,
    // Keep data fresh
    staleTime: 10000,
  });
}