import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { Motif } from "@shared/schema";

interface MotifSelectorProps {
  selectedMotif: Motif | null;
  onSelectMotif: (motif: Motif | null) => void;
}

export default function MotifSelector({ selectedMotif, onSelectMotif }: MotifSelectorProps) {
  const { data: motifs = [], isLoading } = useQuery<Motif[]>({
    queryKey: ['/api/motifs'],
  });

  const getMotifColor = (motifName: string) => {
    const colorMap: Record<string, string> = {
      lion: 'text-amber-600',
      eagle: 'text-gray-700',
      butterfly: 'text-pink-500',
      deer: 'text-amber-700',
      wolf: 'text-gray-800',
      tree: 'text-green-600',
    };
    
    return colorMap[motifName] || 'text-gray-600';
  };

  const positionButtons = [
    { id: 'top-left', label: '↖', name: 'Oben Links' },
    { id: 'top-center', label: '↑', name: 'Oben Mitte' },
    { id: 'top-right', label: '↗', name: 'Oben Rechts' },
    { id: 'center-left', label: '←', name: 'Mitte Links' },
    { id: 'center', label: '●', name: 'Mitte' },
    { id: 'center-right', label: '→', name: 'Mitte Rechts' },
    { id: 'bottom-left', label: '↙', name: 'Unten Links' },
    { id: 'bottom-center', label: '↓', name: 'Unten Mitte' },
    { id: 'bottom-right', label: '↘', name: 'Unten Rechts' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiermotive</h3>
          <div className="animate-pulse">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiermotive</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {motifs.map((motif) => (
            <Button
              key={motif.id}
              variant="outline"
              onClick={() => onSelectMotif(motif)}
              className={`p-3 h-auto flex-col space-y-1 text-center ${
                selectedMotif?.id === motif.id
                  ? 'border-amber-500 bg-amber-50 text-amber-600'
                  : 'border-gray-200 hover:border-amber-500'
              }`}
            >
              <i className={`${motif.iconClass} text-2xl ${getMotifColor(motif.name)}`} />
              <div className="text-xs font-medium">{motif.displayName}</div>
              <div className="text-xs text-gray-500">€{motif.price.toFixed(2)}</div>
            </Button>
          ))}
        </div>
        
        {selectedMotif && (
          <>
            <div className="mb-4">
              <Label className="text-xs text-gray-500 mb-2 block">Motivgröße</Label>
              <Slider
                defaultValue={[25]}
                min={10}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {positionButtons.map((position) => (
                  <Button
                    key={position.id}
                    variant="outline"
                    size="sm"
                    className="p-2 text-xs hover:bg-gray-50"
                  >
                    {position.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
