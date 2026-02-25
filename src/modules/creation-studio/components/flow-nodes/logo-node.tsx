
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";


interface LogoNodeProps {
  data: {
    url: string;
    format: string;
    label: string;
    isLarge?: boolean;
  };
}

export const LogoNode = ({ data }: LogoNodeProps) => {
  return (
    <div className="relative group z-50 scale-150">
      <Card className="w-52 overflow-hidden border-primary/20 bg-surface-container-lowest/80 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/10">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[120px]">
          {data.url && (
            <picture className="relative block p-0 m-0 max-w-64 max-h-64 overflow-hidden">
              <source srcSet={data.url} type={data.format} />
              <img
                src={data.url}
                alt="Brand Logo"
                className="max-w-full max-h-full max-auto aspect-auto object-contain drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/200x100?text=Logo+Not+Found";
                }}
              />
            </picture>
          )}
          <div className="mt-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
            Format: {data.format || "PNG"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
