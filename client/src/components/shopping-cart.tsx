import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemWithDetails {
  id: number;
  imageId: number;
  frameId: number | null;
  motifId: number | null;
  totalPrice: number;
  image: any;
  frame: any;
  motif: any;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Artikel entfernt",
        description: "Der Artikel wurde aus dem Warenkorb entfernt.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Artikel konnte nicht aus dem Warenkorb entfernt werden.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Warenkorb geleert",
        description: "Alle Artikel wurden aus dem Warenkorb entfernt.",
      });
    },
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Warenkorb</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Warenkorb ist leer</h3>
              <p className="text-gray-500">Fügen Sie Bilder hinzu, um mit dem Einkauf zu beginnen.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image?.thumbnailUrl}
                      alt={item.image?.alt || 'Cart item'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.image?.originalName || 'Bild'}
                        {item.frame && ` mit ${item.frame.displayName}-Rahmen`}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>• Grundpreis Druck: €15.00</div>
                        {item.frame && (
                          <div>• {item.frame.displayName} Rahmen (+€{item.frame.price.toFixed(2)})</div>
                        )}
                        {item.motif && (
                          <div>• {item.motif.displayName}-Motiv (+€{item.motif.price.toFixed(2)})</div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-900">
                          €{item.totalPrice.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemMutation.mutate(item.id)}
                          disabled={removeItemMutation.isPending}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Zwischensumme:</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Versand:</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Kostenlos' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal <= 50 && (
                  <div className="text-sm text-amber-600 mb-2">
                    Noch €{(50 - subtotal).toFixed(2)} für kostenlosen Versand
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>Gesamt:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "Zur Kasse",
                      description: "Diese Funktion ist noch nicht implementiert.",
                    });
                  }}
                >
                  Zur Kasse
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Weiter einkaufen
                </Button>

                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => clearCartMutation.mutate()}
                    disabled={clearCartMutation.isPending}
                  >
                    Warenkorb leeren
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
