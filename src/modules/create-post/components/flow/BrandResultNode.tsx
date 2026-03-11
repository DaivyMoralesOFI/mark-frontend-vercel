import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";

const BrandResultNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;

    if (!brand) return null;

    // Let's get the first 5 colors
    const colorRoles = Object.entries(brand.color_system.roles).slice(0, 5);

    return (
        <div className="relative p-0 flex justify-center items-center text-foreground font-sans">
            <Card className="p-7 gap-6 flex flex-col items-center border border-primary/40 shadow-2xl min-w-[360px] max-w-[420px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-[2.5rem] transition-all duration-500">

                {/* Header - Identity */}
                <div className="flex flex-col items-center gap-4 w-full border-b border-outline-variant/20 pb-6">
                    <div className="relative group">
                        {brand.brand_identity.logo.url ? (
                            <img
                                src={brand.brand_identity.logo.url}
                                alt={brand.brand_identity.name}
                                className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                <span className="text-xs font-bold text-primary">No Logo</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground leading-none">{brand.brand_identity.name}</h2>
                        <div className="flex gap-2 mt-3">
                            <span className="text-[10px] bg-primary/20 text-primary-light dark:text-primary px-3 py-1 rounded-lg uppercase font-bold tracking-widest border border-primary/20">
                                {brand.brand_identity.industry.split(' ')[0] || "Brand"}
                            </span>
                            <span className="text-[10px] bg-white/5 dark:bg-white/[0.05] text-muted-foreground px-3 py-1 rounded-lg uppercase font-bold tracking-widest border border-outline-variant/10">
                                {brand.brand_identity.brand_archetype}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="w-full flex flex-col gap-3">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest w-full text-center">Brand Palette</span>
                    <div className="flex gap-2.5 justify-center w-full">
                        {colorRoles.map(([role, color]) => (
                            <div
                                key={role}
                                className="w-11 h-11 rounded-2xl border border-white/10 shadow-lg transition-transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-help"
                                style={{ backgroundColor: color.hex }}
                                title={`${role}: ${color.hex}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Fonts */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-outline-variant/10">
                        <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider">Headings</span>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground truncate">{brand.typography.headings.font_family}</span>
                            <span className="text-[10px] text-muted-foreground/40 font-medium">{brand.typography.headings.classification}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-outline-variant/10">
                        <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider">Body Typography</span>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground truncate">{brand.typography.body.font_family}</span>
                            <span className="text-[10px] text-muted-foreground/40 font-medium">{brand.typography.body.classification}</span>
                        </div>
                    </div>
                </div>

            </Card>

            {/* Invisible handles to satisfy ReactFlow connection mechanics if ever needed */}
            <Handle type="source" position={Position.Right} className="opacity-0" />
            <Handle type="target" position={Position.Left} className="opacity-0" />
        </div>
    );
};

export default BrandResultNode;
