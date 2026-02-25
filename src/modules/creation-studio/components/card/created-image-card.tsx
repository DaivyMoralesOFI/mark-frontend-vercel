import { Card, CardContent } from "@/shared/components/ui/card";
import { transformGoogleDriveUrl } from "@/core/utils/image-utils";

export function CreatedImageCard({ image }: { image: File | string }) {
  const imageUrl =
    image instanceof File
      ? URL.createObjectURL(image)
      : transformGoogleDriveUrl(image);
  console.log("imageUrl", { imageUrl });

  return (
    <Card className="overflow-hidden p-0">
      {" "}
      {/* Añadido overflow-hidden */}
      <CardContent className="p-0">
        {" "}
        {/* Eliminado p-0 para que la imagen ocupe todo */}
        <picture className="block w-full h-full">
          <img
            src={imageUrl}
            alt="created image"
            referrerPolicy="no-referrer" // 👈 CRITICO: evita bloqueos de seguridad de Google
            className="w-full h-auto block" // simplificado para asegurar visibilidad
            onLoad={() => console.log("✅ Imagen cargada")}
            onError={() =>
              console.error("❌ Error cargando imagen:", imageUrl)
            }
          />
        </picture>
      </CardContent>
    </Card>
  );
}
