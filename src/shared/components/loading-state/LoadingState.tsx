import { Loader2 } from "lucide-react";

export const LoadingState = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
        </div>
    );
  };