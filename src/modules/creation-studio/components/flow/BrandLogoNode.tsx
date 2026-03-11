import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";

const BrandLogoNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const logoUrl = brand.brand_identity.logo.url;
    const format = brand.brand_identity.logo.format?.toUpperCase() || "PNG";

    return (
        <div className="relative flex justify-center items-center text-foreground font-sans">
            <Card className="p-5 flex flex-col items-center gap-4 border border-outline-variant/30 shadow-xl min-w-[220px] max-w-[260px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all hover:border-primary/20">
                {/* Title */}
                <div className="flex items-center gap-2 self-start mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Brand Logo</span>
                </div>

                {/* Logo Image */}
                <div className="w-full flex items-center justify-center bg-white/5 dark:bg-white/[0.02] rounded-2xl border border-outline-variant/10 py-6 px-4 group overflow-hidden h-32">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={brand.brand_identity.name}
                            className="h-full w-auto object-contain transition-transform group-hover:scale-110 duration-500"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-outline-variant/10 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-muted-foreground/30 font-sans">?</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground/40 font-semibold font-sans">No Logo Found</span>
                        </div>
                    )}
                </div>

                {/* Info Footer */}
                <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                        Format
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary-light dark:text-primary px-2 py-0.5 rounded-md font-bold font-sans">
                        {format}
                    </span>
                </div>
            </Card>

            {/* Handles for edges */}
            <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
            <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
            <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
        </div>
    );
};

export default BrandLogoNode;
