import { useState, useEffect } from 'react';
import { Menu, X, Phone, Flame, ShoppingCart, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Our Wood', href: '#products' },
  { name: 'Why Us', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

export default function Navbar({ cartCount, onOpenCart, onAdminClick, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user] = useAuthState(auth);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar for Admin/Login */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-6 flex justify-center sm:justify-end items-center gap-6 relative z-[60]">
        {user ? (
          <>
            <span className="hidden sm:inline">Logged in as <span className="text-white font-medium">{user.email}</span></span>
            {isAdmin && (
              <button onClick={onAdminClick} className="text-white font-bold hover:text-amber-400 flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1 rounded-full">
                <LayoutDashboard size={14} /> Go to Admin Dashboard
              </button>
            )}
            <button onClick={handleLogout} className="hover:text-white flex items-center gap-1.5 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="text-white font-bold hover:text-amber-400 flex items-center gap-1.5 transition-colors bg-white/10 px-4 py-1 rounded-full">
            <LogIn size={14} /> Admin / Staff Login
          </button>
        )}
      </div>

      <nav
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
          scrolled ? 'top-0 bg-white/90 backdrop-blur-md shadow-sm py-3' : 'top-8 bg-transparent'
        )}
      >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
            <Flame size={24} />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-amber-900">
            Premier Firewood
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-stone-700 hover:text-amber-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-stone-700 hover:text-amber-900 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 bg-amber-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-800 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Phone size={16} />
            Order Now
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-stone-700"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="text-stone-900 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-stone-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-serif font-medium text-stone-800 hover:text-amber-900"
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex flex-col gap-4 pt-4 border-t border-stone-100">
              {isAdmin && (
                <button 
                  onClick={() => { onAdminClick?.(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-stone-800 font-medium"
                >
                  <LayoutDashboard size={20} />
                  Admin Dashboard
                </button>
              )}
              {user ? (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-red-600 font-medium"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => { handleLogin(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-stone-800 font-medium"
                >
                  <LogIn size={20} />
                  Login
                </button>
              )}
            </div>

            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 bg-amber-900 text-white py-4 rounded-xl font-medium"
            >
              <Phone size={20} />
              Call to Order
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}
