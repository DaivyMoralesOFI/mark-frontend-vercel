// PostCard.tsx
//
// This file defines the PostCard component, which displays a single post's details in a styled card.
// It shows the author, date, post text, feedback, likes, and a link to the original post.
// The component is styled with Tailwind CSS and uses UI primitives for layout and interactivity.

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Post } from "../types/postTypes";
import { Calendar, EllipsisVertical } from "lucide-react";



/**
 * Props for PostCard
 * @property {Post} post - The post data to display
 */
interface PostCardProps {
  post: Post;
}

/**
 * PostCard
 *
 * Renders a card displaying post details, including:
 * - Author avatar and name
 * - Post date
 * - Post text and feedback
 * - Like count with heart icon
 * - Link to the original post
 *
 * Used in the PostGrid to show a list of posts.
 */
export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center justify-center">
        <CardTitle>
          <div className="flex items-center gap-2">
            {/* Author avatar */}
            <img
              src="ofi-dark.svg"
              alt="Ofi Services Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              {/* Author name and post date */}
              <p>{post.title}</p>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex items-start justify-start gap-4">
          <div className="flex justify-center items-center gap-2">
            <Calendar size={12} />
            <span>{post.date instanceof Date ? post.date.toLocaleDateString() : new Date(post.date).toLocaleDateString()}</span>
          </div>

        </CardDescription>
        <CardAction>
          <EllipsisVertical size={12} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <p className="line-clamp-3">{post.copy}</p>
      </CardContent>
      <CardFooter className="justify-between mt-auto">
        {/* <PostFeedbackDialog post_feedback={post.Feedback} /> */}
        {/* <a href={post.Link} target="_blank" rel="noopener noreferrer">
            <Button variant="link">Go to post</Button>
          </a> */}
      </CardFooter>
    </Card>
  );
};