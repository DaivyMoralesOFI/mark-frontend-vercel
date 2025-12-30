import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { VideoPostCard } from "../cards/video-post-card";

export const VideoPostCarrousel = () => {
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
            dragFree: false, // Permite arrastre libre como Netflix
          }}
        >
          <CarouselContent className="p-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 ">
                <VideoPostCard />
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
