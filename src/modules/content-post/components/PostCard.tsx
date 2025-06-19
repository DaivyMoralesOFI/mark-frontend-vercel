// PostCard.tsx
//
// This file defines the PostCard component, which displays a single post's details in a styled card.
// It shows the author, date, post text, feedback, likes, and a link to the original post.
// The component is styled with Tailwind CSS and uses UI primitives for layout and interactivity.

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Post } from "../types/postTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

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
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Author avatar */}
              <img
                src="https://media.licdn.com/dms/image/v2/D4E0BAQHtuU6xP83E8g/company-logo_200_200/B4EZcqrPTBHAAI-/0/1748767668295/ofi_services_logo?e=1755129600&v=beta&t=Tg0EKOZiblV0wudSZ0L4LfscqosDQVUPq4l7d8tmygM"
                alt="Ofi Services Logo"
                className="w-10 h-10 rounded-full object-cover border border-purple-200"
              />
              <div>
                {/* Author name and post date */}
                <CardTitle>{post.Author}</CardTitle>
                <p className="text-sm text-muted-foreground">{post.Date}</p>
              </div>
            </div>
            {/* Like badge with heart icon */}
            <Badge className="flex items-center space-x-1 bg-white text-red-500">
              <Heart size={14} />
              <span>{post.likes}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Post text */}
          <p className="mb-4">{post.Text}</p>
          {/* Post feedback as a blockquote */}
          <blockquote className="border-l-4 border-purple-500 pl-4 italic text-sm text-muted-foreground">
            {post.Feedback}
          </blockquote>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Link to the original post */}
          <a href={post.Link} target="_blank" rel="noopener noreferrer">
            <Button variant="link">See post</Button>
          </a>
        </CardFooter>
      </Card>
    );
  };