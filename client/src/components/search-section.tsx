import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Image } from "@shared/schema";

interface SearchSectionProps {
  onSearchResults: (images: Image[]) => void;
}

export default function SearchSection({ onSearchResults }: SearchSectionProps) {
  const [searchCode, setSearchCode] = useState("");
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("GET", `/api/images/search?code=${encodeURIComponent(code)}`);
      return await response.json();
    },
    onSuccess: (data: Image[]) => {
      if (data.length === 0) {
        toast({
          title: "Keine Bilder gefunden",
          description: "Für den eingegebenen Bildcode wurden keine Bilder gefunden. Bitte prüfen Sie den Code und versuchen Sie es erneut.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Bilder gefunden",
          description: `${data.length} Bilder wurden gefunden.`,
        });
      }
      onSearchResults(data);
    },
    onError: () => {
      toast({
        title: "Fehler bei der Suche",
        description: "Es ist ein Fehler beim Suchen der Bilder aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchCode.trim()) {
      toast({
        title: "Bildcode erforderlich",
        description: "Bitte geben Sie einen Bildcode ein.",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate(searchCode.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ihre Fotos finden</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="imageCode" className="block text-sm font-medium text-gray-700 mb-2">
                Bildcode eingeben
              </Label>
              <Input
                id="imageCode"
                type="text"
                placeholder="z.B. ZB2024-001-ABC"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
                disabled={searchMutation.isPending}
              />
              <p className="text-sm text-gray-500 mt-1">
                Den Bildcode haben Sie von Ihrem Fotografen erhalten
              </p>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={searchMutation.isPending}
                className="px-6"
              >
                {searchMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Suchen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
