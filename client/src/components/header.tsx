import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

interface HeaderProps {
  onOpenCart: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
  });

  const itemCount = cartItems.length;
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">ZooBild</h1>
            <span className="text-sm text-gray-500">Professioneller Bildkonfigurator</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">€{total.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Gesamt</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
