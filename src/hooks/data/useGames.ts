import { useState, useEffect } from "react";
import { CanceledError } from "axios";
import { ApiClient } from "@/services";
import { ApiGame, ApiDefaultResponse } from "@/typing/api";

/**
 * Fetches a list of games from the API endpoint.
 * @returns {ApiGame[]} games - List of games fetched from the API.
 * @returns {string} error - Error message resulting from the API operation, if any.
 */
const useGames = () => {
  const [games, setGames] = useState<ApiGame[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /**
     * The AbortController provides a way to abort (cancel) a request or a fetch operation.
     */
    const controller = new AbortController();

    setLoading(true);

    /**
     * The signal option in the "fetch" or "axios" request allows to associate an AbortController's signal with the request.
     */
    ApiClient.get<ApiDefaultResponse<ApiGame>>("/games", {
      signal: controller.signal,
    })
      .then((res) => {
        setGames(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    /*
      .finally(() => {
        // Might not work in strict mode
        setLoading(false);
      })
      //*/

    /**
     * In this case, the cleanup function is aimed at avoiding unnecessary operations
     * When the Component is unmounted, we cancel the ongoing HTTP request
     * For example, that means, if the component unmounts before the request is completed,
     * ... the cleanup function is triggered, calling controller.abort() to cancel the request.
     */
    return () => controller.abort();
  }, []);

  return {
    games,
    loading,
    error,
  };
};

export default useGames;
