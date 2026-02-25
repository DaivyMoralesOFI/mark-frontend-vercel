import { Card } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";

const ExtractingNode = () => {
    return (
        <div className="relative p-0 flex justify-center items-center">
            <Card className="p-8 gap-4 flex flex-col items-center justify-center border border-primary/50 shadow-2xl min-w-[300px] min-h-[200px] bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-center text-lg font-bold">Extracting Brand DNA...</h2>
                    <p className="text-center text-sm text-muted-foreground">This might take a minute as we decode the visual identity.</p>
                </div>
            </Card>
        </div>
    );
};

export default ExtractingNode;
