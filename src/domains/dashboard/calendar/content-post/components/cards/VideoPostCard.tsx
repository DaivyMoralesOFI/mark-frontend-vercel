import { Avatar, AvatarImage } from "@/shared/components/ui/Avatar";
import { Button } from "@/shared/components/ui/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/Card";
import { Download, EllipsisVertical } from "lucide-react";
import { VideoPost } from "../../schemas/VideoPosts.schemas";
import { DateTime } from "luxon";

type VideoPostCardProps = {
  video: VideoPost;
};

export const VideoPostCard = ({ video }: VideoPostCardProps) => {
  return (
    <Card
      key={video.id}
      className="p-4 border-0 shadow-none gap-1 hover:bg-primary/20 hover:cursor-pointer duration-300 relative"
    >
      <CardHeader className="absolute top-8 right-12 z-[999]">
        <CardAction>
          <a href={video.video_url}>
            <Button
              variant={"ghost"}
              className="h-8 w-8 flex justify-center items-center text-white rounded-full hover:text-gray-700 hover:bg-gray-200"
            >
              <Download size={12} />
            </Button>
          </a>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative flex gap-0 p-0 m-0 overflow-hidden">
          <picture className="max-w-full max-h-[200px] lg:max-h-[300px] block m-0 p-0 overflow-hidden rounded-lg">
            <source src={video.thumbnail_url} />
            <img
              src={video.thumbnail_url}
              className="object-contain object-center w-[500px]"
              alt="video post thumbnail"
            />
          </picture>
        </div>
      </CardContent>
      <CardFooter className="px-0 flex-col items-start">
        <div className="flex items-center justify-between w-full gap-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="ofi-dark.svg" />
          </Avatar>
          <div className="flex items-start flex-2">
            <p className="font-bold">{video.name}</p>
          </div>
          <div>
            <Button variant={"ghost"}>
              <EllipsisVertical size={12} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400 font-medium text-sm">
            {DateTime.fromISO(video.created_at).setLocale("en").toRelative()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

//video
