import { motion } from 'motion/react';
import { ArrowRight, Flame, Truck, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1520114878144-6123749968dd?auto=format&fit=crop&q=80&w=1920"
          alt="Cozy fireplace with wood"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-fire-orange/20 backdrop-blur-md border border-fire-orange/30 px-4 py-2 rounded-full text-fire-orange font-medium text-sm mb-6">
            <Flame size={16} />
            <span>Premium Kiln-Dried Firewood</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
            Warmth Delivered to <br />
            <span className="text-amber-400 italic">Your Doorstep.</span>
          </h1>
          
          <p className="text-lg text-stone-200 mb-10 max-w-lg leading-relaxed">
            Experience the difference of high-quality, kiln-dried firewood. 
            Cleaner burning, longer lasting, and ready for your hearth today.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950">
              Order Firewood Now
              <ArrowRight size={20} />
            </a>
            <a href="#products" className="btn-secondary border-white text-white hover:bg-white/10">
              View Our Wood
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3 text-white/80">
              <Truck className="text-amber-400" size={24} />
              <span className="text-sm font-medium">Fast Local Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <ShieldCheck className="text-amber-400" size={24} />
              <span className="text-sm font-medium">100% Quality Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none" />
    </section>
  );
}
