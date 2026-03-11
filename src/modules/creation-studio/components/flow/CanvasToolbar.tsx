import { Pen, Square, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { useState } from "react";

type CanvasTool = "pen" | "shape" | null;

const CanvasToolbar = () => {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    const tools = [
        { id: "pen" as CanvasTool, icon: Pen, label: "Draw" },
        { id: "shape" as CanvasTool, icon: Square, label: "Shape" },
    ];

    return (
        <div className="flex items-center bg-surface-container-high/80 dark:bg-surface-container-high/60 backdrop-blur-xl border border-outline-variant/30 dark:border-outline/20 rounded-xl p-1 shadow-sm">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() =>
                        setActiveTool(activeTool === tool.id ? null : tool.id)
                    }
                    className={cn(
                        "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                        activeTool === tool.id
                            ? "bg-on-surface/10 dark:bg-on-surface/15 text-on-surface"
                            : "text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5"
                    )}
                    title={tool.label}
                >
                    <tool.icon className="w-4 h-4" strokeWidth={1.8} />
                </button>
            ))}
            <div className="w-px h-5 bg-outline-variant/20 dark:bg-outline/15 mx-0.5" />
            <button
                className="flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
                title="More tools"
            >
                <MoreHorizontal className="w-4 h-4" strokeWidth={1.8} />
            </button>
        </div>
    );
};

export default CanvasToolbar;
