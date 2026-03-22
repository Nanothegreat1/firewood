import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Products, { Product } from './components/Products';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';

interface CartItem extends Product {
  quantity: number;
}

type View = 'home' | 'checkout' | 'success' | 'admin';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const [showToast, setShowToast] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (view !== 'home') {
      window.scrollTo(0, 0);
    }
  }, [view]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        } else {
          // Create user profile if it doesn't exist
          const isDefaultAdmin = user.email === 'nadingdirane2@gmail.com';
          const role = isDefaultAdmin ? 'admin' : 'customer';
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: role,
            createdAt: serverTimestamp()
          });
          setIsAdmin(isDefaultAdmin);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setView('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  if (view === 'admin' && isAdmin) {
    return <AdminDashboard onBack={() => setView('home')} />;
  }

  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)} 
          onAdminClick={() => setView('admin')}
          isAdmin={isAdmin}
        />
        <Checkout 
          items={cartItems} 
          onBack={() => setView('home')} 
          onSuccess={handleOrderSuccess}
        />
        <Footer />
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar 
          cartCount={0} 
          onOpenCart={() => {}} 
          onAdminClick={() => setView('admin')}
          isAdmin={isAdmin}
        />
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-stone-100"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-stone-600 mb-10 leading-relaxed">
              We've received your order. We'll contact you shortly for manual payment to finalize your delivery.
            </p>
            <button 
              onClick={() => setView('home')}
              className="btn-primary w-full"
            >
              Back to Home
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-amber-200 selection:text-amber-900">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
        onAdminClick={() => setView('admin')}
        isAdmin={isAdmin}
      />
      <main>
        <Hero />
        <Features />
        <Products onAddToCart={handleAddToCart} />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 24 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6"
          >
            <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Order placed successfully!</p>
                <p className="text-sm text-stone-400">We'll contact you for manual payment.</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-stone-500 hover:text-white transition-colors">
                <ShieldCheck size={20} className="rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
