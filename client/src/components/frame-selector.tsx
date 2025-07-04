import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { Frame } from "@shared/schema";

interface FrameSelectorProps {
  selectedFrame: Frame | null;
  onSelectFrame: (frame: Frame | null) => void;
}

export default function FrameSelector({ selectedFrame, onSelectFrame }: FrameSelectorProps) {
  const { data: frames = [], isLoading } = useQuery<Frame[]>({
    queryKey: ['/api/frames'],
  });

  const getFrameStyle = (frame: Frame) => {
    const colorMap: Record<string, string> = {
      classic: 'from-amber-600 to-amber-800 border-amber-700',
      modern: 'from-gray-800 to-gray-900 border-gray-600',
      vintage: 'from-amber-400 to-yellow-600 border-yellow-700',
      elegant: 'from-rose-400 to-pink-600 border-rose-500',
    };
    
    return colorMap[frame.name] || 'from-gray-400 to-gray-600 border-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rahmen auswählen</h3>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rahmen auswählen</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {frames.map((frame) => (
            <Button
              key={frame.id}
              variant="outline"
              onClick={() => onSelectFrame(frame)}
              className={`p-3 h-auto flex-col space-y-2 ${
                selectedFrame?.id === frame.id
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-blue-600'
              }`}
            >
              <div 
                className={`w-full aspect-square bg-gradient-to-br rounded border-4 ${getFrameStyle(frame)}`}
                style={{ borderStyle: frame.borderStyle }}
              />
              <span className="text-sm font-medium">{frame.displayName}</span>
              <div className="text-xs text-gray-500">€{frame.price.toFixed(2)}</div>
            </Button>
          ))}
        </div>
        
        {selectedFrame && (
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Rahmenbreite</Label>
            <Slider
              value={[selectedFrame.borderWidth]}
              onValueChange={() => {}} // This would update frame width in a real implementation
              min={5}
              max={25}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
