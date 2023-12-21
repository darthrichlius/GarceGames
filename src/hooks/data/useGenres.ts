import { ApiGameGenre } from "@/typing/api";
import useData from "./useData";
import ApiConfig from "@/config/api";
import GenresStaticData from "@/data/static/genres";
import ApiService from "@/services/ApiClient";
import { UseQueryOptions } from "@tanstack/react-query";

/**
 * Fetches a list of genres from the API endpoint.
 * @returns {ApiGameGenre[]} genress - List of genress fetched from the API.
 * @returns {string} error - Error message resulting from the API operation, if any.
 */
const useGenress = () => {
  const { data: genres, ...rest } = useData<ApiGameGenre>({
    qKey: ApiConfig.resources["genres"].default.CACHE_KEY,
    qFn: () => ApiService.getAll<ApiGameGenre>({ resource: "genres" }),
    /**
     * There is a very low probability "Genres" data to change
     * Therefore we can rely on static data then update them afterwards
     * The possibility of enabling fetch anyway make the process 100% reliable and consistent with the remote data
     */
    moreConfig: {
      initialData: GenresStaticData,
    } as UseQueryOptions,
  });

  return { ...rest, genres };
};

export default useGenress;
