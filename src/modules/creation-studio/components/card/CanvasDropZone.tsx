
import { useCallback, useState } from "react";
import { cn } from "@/shared/utils/utils";

interface CanvasDropZoneProps {
    onFileDrop?: (files: FileList) => void;
}

const CanvasDropZone = ({ onFileDrop }: CanvasDropZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onFileDrop?.(e.dataTransfer.files);
            }
        },
        [onFileDrop]
    );

    return (
        <div
            className={cn(
                "w-[520px] h-[380px] rounded-2xl",
                "border-2 border-dashed transition-all duration-300 ease-out",
                "flex flex-col items-center justify-center gap-3",
                "select-none cursor-default",
                isDragging
                    ? "border-primary/60 bg-primary/5 scale-[1.02]"
                    : "border-outline-variant/40 dark:border-outline/30 bg-transparent"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <p
                className={cn(
                    "text-sm transition-colors duration-200",
                    isDragging
                        ? "text-primary"
                        : "text-on-surface-variant/50 dark:text-on-surface-variant/40"
                )}
            >
                Enter a prompt below or drag & drop your media
            </p>
        </div>
    );
};

export default CanvasDropZone;
