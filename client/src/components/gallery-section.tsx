import { Card, CardContent } from "@/components/ui/card";
import { Expand } from "lucide-react";
import type { Image } from "@shared/schema";

interface GallerySectionProps {
  images: Image[];
  onSelectImage: (image: Image) => void;
}

export default function GallerySection({ images, onSelectImage }: GallerySectionProps) {
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Ihre Fotogalerie</h2>
            <span className="text-sm text-gray-500">{images.length} Bilder gefunden</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div 
                key={image.id}
                className="group cursor-pointer"
                onClick={() => onSelectImage(image)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                  <img 
                    src={image.thumbnailUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
