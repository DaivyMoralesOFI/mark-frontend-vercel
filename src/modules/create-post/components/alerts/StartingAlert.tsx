import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/AlertDialog";

type StartingAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StartingAlert({ open, onOpenChange }: StartingAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome back to Creation Studio</AlertDialogTitle>
          <AlertDialogDescription>
            To start creating your content, you can type your text or upload an
            image, and select a tone, type and platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-primary text-on-primary py-3">
            Let's start
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
