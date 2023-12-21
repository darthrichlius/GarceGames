import { Box, Button, SimpleGrid, Spinner, useToast } from "@chakra-ui/react";
import { compact as _compact } from "lodash";
import { GameCard, GameCardSkeleton } from "@/components";
import { useGames } from "@/hooks";
import { ApiGameQuery } from "@/types/api";
import { ArrayUtils } from "@/utils";
import ApiConfig from "@/config/api";
import InfiniteScroll from "react-infinite-scroll-component";
import AppConfig from "@/config/app";

const GameGrid = ({ filters, ordering, search }: ApiGameQuery) => {
  const toast = useToast();
  const skeletons = ArrayUtils.newRandomArray(
    ApiConfig.resources.games.default.limit || 8
  );

  const {
    games,
    loading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGames({
    filters: {
      genres: _compact(filters?.genres ?? []),
      parent_platforms: _compact(filters?.parent_platforms ?? []),
    },
    ordering,
    search,
  });

  if (error) {
    toast({
      title: error.response?.status !== 500 ? "Error" : "Internal Error",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return null;
  }

  return (
    <Box marginY={10}>
      {AppConfig.games?.infiniteScroll && (
        <InfiniteScroll
          dataLength={games.length}
          hasMore={hasNextPage}
          next={() => fetchNextPage()}
          loader={<Spinner />}
        >
          <DataGrid games={games} loading={loading} skeletons={skeletons} marginBottom={10} />
        </InfiniteScroll>
      )}
      {!AppConfig.games?.infiniteScroll && (
        <>
          <DataGrid games={games} loading={loading} skeletons={skeletons} />
          <Box marginTop={10}>
            {!loading && hasNextPage && (
              <Button
                isLoading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                Load More {isFetchingNextPage && "..."}
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

const DataGrid = ({ games, loading, skeletons, ...rest }) => {
  return (
    <SimpleGrid
      columns={{
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      }}
      spacing={10}
      {...rest}
    >
      {loading && skeletons.map((i) => <GameCardSkeleton key={i} />)}
      {!loading &&
        games &&
        games.map((game) => <GameCard key={game.id} game={game} />)}
    </SimpleGrid>
  );
};

export default GameGrid;
