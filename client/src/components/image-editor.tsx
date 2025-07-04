import { useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, ShoppingCart, X } from "lucide-react";
import FrameSelector from "./frame-selector";
import MotifSelector from "./motif-selector";
import { useImageEditor } from "@/hooks/use-image-editor";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Image, Frame, Motif } from "@shared/schema";

interface ImageEditorProps {
  image: Image;
  selectedFrame: Frame | null;
  selectedMotif: Motif | null;
  onSelectFrame: (frame: Frame | null) => void;
  onSelectMotif: (motif: Motif | null) => void;
  onBackToGallery: () => void;
}

export default function ImageEditor({
  image,
  selectedFrame,
  selectedMotif,
  onSelectFrame,
  onSelectMotif,
  onBackToGallery,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    zoomLevel,
    canvasSize,
    zoomIn,
    zoomOut,
    resetZoom,
    drawImageWithEffects,
  } = useImageEditor(canvasRef, image, selectedFrame, selectedMotif);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const cartItem = {
        imageId: image.id,
        frameId: selectedFrame?.id || null,
        motifId: selectedMotif?.id || null,
        configuration: {
          zoomLevel,
          frameSettings: selectedFrame ? { width: selectedFrame.borderWidth } : null,
          motifSettings: selectedMotif ? { size: 25, position: 'top-right' } : null,
        },
      };

      const response = await apiRequest("POST", "/api/cart", cartItem);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Zum Warenkorb hinzugefügt",
        description: "Das konfigurierte Bild wurde erfolgreich zum Warenkorb hinzugefügt.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Bild konnte nicht zum Warenkorb hinzugefügt werden.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    drawImageWithEffects();
  }, [image, selectedFrame, selectedMotif, zoomLevel, drawImageWithEffects]);

  const calculateTotalPrice = () => {
    let total = 15.00; // Base price
    if (selectedFrame) total += selectedFrame.price;
    if (selectedMotif) total += selectedMotif.price;
    return total;
  };

  return (
    <section className="grid lg:grid-cols-3 gap-8">
      {/* Canvas Editor */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Bildbearbeitung</h2>
              <Button
                variant="ghost"
                onClick={onBackToGallery}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Galerie
              </Button>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="w-full h-full cursor-crosshair"
                style={{ imageRendering: 'pixelated' }}
              />
              
              {/* Zoom controls */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={zoomIn}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={zoomOut}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={resetZoom}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>
            
            {/* Editor Controls */}
            <div className="flex flex-wrap gap-4">
              {selectedFrame && (
                <Button 
                  variant="outline"
                  onClick={() => onSelectFrame(null)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Rahmen entfernen
                </Button>
              )}
              {selectedMotif && (
                <Button 
                  variant="outline"
                  onClick={() => onSelectMotif(null)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Motiv entfernen
                </Button>
              )}
              <div className="ml-auto">
                <div className="text-right mb-2">
                  <div className="text-lg font-semibold text-gray-900">
                    €{calculateTotalPrice().toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Gesamtpreis</div>
                </div>
                <Button 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  In Warenkorb
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customization Options */}
      <div className="space-y-6">
        <FrameSelector
          selectedFrame={selectedFrame}
          onSelectFrame={onSelectFrame}
        />
        
        <MotifSelector
          selectedMotif={selectedMotif}
          onSelectMotif={onSelectMotif}
        />
      </div>
    </section>
  );
}
