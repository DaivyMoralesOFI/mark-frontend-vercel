import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { EllipsisVertical } from "lucide-react";

export const VideoPostCard = () => {
  return (
    <Card className="p-4 border-0 shadow-none gap-1 hover:bg-primary/20 hover:cursor-pointer duration-300">
      <CardContent className="p-0">
        <div className="relative flex gap-0 p-0 m-0 overflow-hidden">
          <picture className="max-w-full max-h-[200px] lg:max-h-[300px] block m-0 p-0 overflow-hidden rounded-lg">
            <source src="https://picsum.photos/500" />
            <img
              src="https://picsum.photos/500"
              className="object-contain object-center"
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
            <p className="font-bold">OFI Christmas Video Campaing</p>
          </div>
          <div>
            <Button variant={"ghost"}>
              <EllipsisVertical size={12} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
            <p className="text-gray-400 font-medium text-sm hover:cursor-pointer hover:font-bold">OFI Services</p>
            <div className="flex gap-2">
                <p className="text-gray-400 font-medium text-sm">100K Views</p>
                <p className="text-gray-400 font-medium text-sm">10 days ago.</p>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
};
