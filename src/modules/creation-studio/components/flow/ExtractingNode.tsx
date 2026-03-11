import { Card } from "@/shared/components/ui/Card";
import { Loader2 } from "lucide-react";

const ExtractingNode = () => {
    return (
        <div className="relative p-0 flex justify-center items-center">
            <Card className="p-8 gap-5 flex flex-col items-center justify-center border border-primary/40 shadow-2xl min-w-[320px] min-h-[220px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all duration-500">
                <div className="relative">
                    <Loader2 className="w-14 h-14 animate-spin text-primary" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse -z-10" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-center text-xl font-bold text-foreground tracking-tight">Extracting Brand DNA...</h2>
                    <p className="text-center text-sm text-muted-foreground/80 max-w-[240px]">This might take a minute as we decode the visual identity.</p>
                </div>
            </Card>
        </div>
    );
};

export default ExtractingNode;
