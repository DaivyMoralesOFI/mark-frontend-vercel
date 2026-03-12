import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/Carousel";
import { VideoPostCard } from "../cards/VideoPostCard";
import { VideoPost } from "../../schemas/VideoPosts.schemas";

type VideoPostCarrouselProps = {
  videos: VideoPost[]
}

export const VideoPostCarrousel = ({videos}:VideoPostCarrouselProps) => {
  return (
    <div className="col-span-12 py-2 flex flex-col justify-start items-start gap-2">
      <div>
        <h2 className="font-bold pl-2">Video Post Collection</h2>
      </div>
      <div className="w-full min-h-60 p-0">
        <Carousel
          className="w-full group"
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent className="flex-row flex-nowrap">
            {videos.map((video, idx) => (
              <CarouselItem key={idx} className="!basis-1/2 lg:!basis-1/3">
                <VideoPostCard video={video} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
