import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

type PostFeedbackDialogProps = {
  post_feedback: string;
};

export const PostFeedbackDialog = ({
  post_feedback,
}: PostFeedbackDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"ghost"}>See Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Makr's feedback</DialogTitle>
          <DialogDescription className="py-4">
            <blockquote className="border-l-4 border-purple-500 pl-4 text-justify">
              {post_feedback}
            </blockquote>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
