import { Card, CardBody, HStack, Heading, Image } from "@chakra-ui/react";
import { map as _map } from "lodash";
import { ApiImage } from "@/services";
import { GameCriticScore, GamePlatformList } from "@/components";
import { ApiGame } from "@/typing/api";
import { UI_CONFIG } from "@/config/ui";

interface Props {
  game: ApiGame;
}

const GameCard = ({ game }: Props) => {
  const croppedImage = ApiImage.getCroppedGameImageUrl(game.background_image);
  return (
    <Card
      borderRadius={UI_CONFIG.gameCard.borderRadius}
      overflow={"hidden"}
      maxWidth={UI_CONFIG.gameCard.sizes.lg.maxWidth}
    >
      <Image src={croppedImage} />
      <CardBody>
        <Heading fontSize={"2xl"}>{game.name}</Heading>
        <HStack justifyContent={"space-between"}>
          {game.parent_platforms && (
            <GamePlatformList
              platforms={_map(game.parent_platforms, "platform")}
            />
          )}
          <GameCriticScore score={game.metacritic} />
        </HStack>
      </CardBody>
    </Card>
  );
};

export default GameCard;