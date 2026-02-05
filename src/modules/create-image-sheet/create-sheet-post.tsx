import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Image } from "lucide-react";

type CreateImageAISheetProps = {
  handleImageGeneration: () => void;
};

export function CreateImageAISheet({
  handleImageGeneration,
}: CreateImageAISheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"agent"}
          className="rounded-none border"
          onClick={() => handleImageGeneration()}
        >
          <Image />
          Create Image with Mark AI
        </Button>
      </SheetTrigger>
      <SheetContent className="py-2">
        <SheetHeader>
          <SheetTitle>Create Image with Mark AI</SheetTitle>
          <SheetDescription>
            Use Mark AI to create an image for your post.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="border rounded-md p-4 bg-outline-variant h-full w-full"></div>
        </div>
        <SheetFooter>
          <Button type="submit">Use this image</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
