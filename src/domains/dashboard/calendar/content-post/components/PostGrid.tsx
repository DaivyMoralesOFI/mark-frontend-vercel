// PostGrid.tsx
//
// This file defines the PostGrid component, which displays a grid of PostCard components for a list of posts.
// It arranges posts responsively in a multi-column layout using Tailwind CSS grid utilities.
// Used in the content post module to show all posts in a visually appealing way.

import { Post } from "../types/PostTypes";
import { PostCard } from "./PostCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/Carousel";

/**
 * Props for PostGrid
 * @property {Post[]} posts - Array of post objects to display
 */
interface PostGridProps {
  posts: Post[];
}

/**
 * PostGrid
 *
 * Renders a responsive grid of PostCard components for each post in the list.
 * Used to display all posts in a section or page.
 */
export const PostGrid = ({ posts }: PostGridProps) => {
  return (
    <div className="col-span-12 py-2 flex flex-col justify-start items-start gap-2">
      <div>
        <h2 className="font-bold pl-2">Post Collection</h2>
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
          <CarouselContent className="flex-row flex-nowrap">
            {posts.map((post, idx) => (
              <CarouselItem key={idx}
                className="!basis-1/3 md:!basis-1/4 lg:!basis-1/5">
                <PostCard post={post} />
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
