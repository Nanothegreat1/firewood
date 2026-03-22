import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Product } from './Products';

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-amber-900" />
                <h2 className="text-xl font-serif font-bold text-stone-900">Your Cart</h2>
                <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-full">
                  {items.length} items
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Your cart is empty</h3>
                    <p className="text-stone-500">Looks like you haven't added any firewood yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-stone-900">{item.name}</h4>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm text-stone-500 line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-amber-900">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-serif font-bold text-2xl text-stone-900">${total}</span>
                </div>
                <p className="text-xs text-stone-500 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-amber-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-800 transition-all shadow-lg active:scale-95"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
