// PostGrid.tsx
//
// This file defines the PostGrid component, which displays a grid of PostCard components for a list of posts.
// It arranges posts responsively in a multi-column layout using Tailwind CSS grid utilities.
// Used in the content post module to show all posts in a visually appealing way.

import { Post } from "../types/postTypes";
import { PostCard } from "./PostCard";

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
      <div className="col-span-12 flex justify-center">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {/* Render a PostCard for each post */}
          {posts.map((post, idx) => (
            <PostCard key={idx} post={post} />
          ))}
        </div>
      </div>
    );
  };