import { useState, useEffect } from "react";
import { Query, User } from "@/lib/types";
import { MOCK_RESPONSES, MOCK_QUERY_HISTORY } from "@/lib/constants";

export const useDashboardData = (currentUser: User | null) => {
  const [query, setQuery] = useState("");
  const [queryLanguage, setQueryLanguage] = useState("en");
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState("");
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [queryHistory, setQueryHistory] = useState<Query[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState(currentUser?.preferredLanguage || "en");
  const [defaultRegion, setDefaultRegion] = useState(currentUser?.region || "Delhi");

  useEffect(() => {
    if (currentUser) {
      // Initialize with user's preferred settings
      setDefaultLanguage(currentUser.preferredLanguage);
      setDefaultRegion(currentUser.region);

      // Load mock history for authenticated users
      if (currentUser.id !== "guest") {
        setQueryHistory(MOCK_QUERY_HISTORY);
      } else {
        setQueryHistory([]); // Guests start with no history
      }
    } else {
      setQueryHistory([]);
    }
  }, [currentUser]);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setQueryLoading(true);
    setQueryError("");
    setResponse("");
    setSources([]);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
    const mockResponse = MOCK_RESPONSES[randomIndex];

    setResponse(mockResponse.text);
    setSources(mockResponse.sources);

    const newQuery: Query = {
      id: Date.now().toString(),
      text: query,
      language: queryLanguage,
      timestamp: new Date(),
      response: mockResponse.text,
      sources: mockResponse.sources
    };

    setQueryHistory(prev => [newQuery, ...prev]);
    setQueryLoading(false);
    setQuery(""); // Clear query input after submission
  };

  const handleApplyPreferences = () => {
    // In a real app, you'd send these to a backend
    console.log("Applying preferences:", { defaultLanguage, defaultRegion });
    if (currentUser) {
      // Update local user object for immediate UI reflection
      // (For a real app, you'd re-fetch or use a state management solution)
      currentUser.preferredLanguage = defaultLanguage;
      currentUser.region = defaultRegion;
    }
  };

  return {
    query,
    setQuery,
    queryLanguage,
    setQueryLanguage,
    queryLoading,
    queryError,
    response,
    setResponse, // Can be used to clear response
    sources,
    queryHistory,
    setQueryHistory, // Can be used to clear history if needed
    defaultLanguage,
    setDefaultLanguage,
    defaultRegion,
    setDefaultRegion,
    handleQuerySubmit,
    handleApplyPreferences,
  };
};