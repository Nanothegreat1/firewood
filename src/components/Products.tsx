import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Info, Loader2, Sparkles } from 'lucide-react';
import { generateProductImage } from '@/src/services/geminiService';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  prompt: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Kiln-Dried Oak',
    description: 'The gold standard for firewood. Long-burning, high heat output, and beautiful flames.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800',
    tag: 'Best Seller',
    prompt: 'a stack of split kiln-dried oak firewood logs, clean cut, golden brown texture',
  },
  {
    id: 2,
    name: 'Mixed Hardwoods',
    description: 'A perfect blend of Oak, Hickory, and Maple for a varied and aromatic fire experience.',
    price: 129,
    image: 'https://images.unsplash.com/photo-1516553174826-d05833723cd4?auto=format&fit=crop&q=80&w=800',
    tag: 'Great Value',
    prompt: 'a variety of mixed hardwood logs for fireplace, maple and hickory, rustic pile',
  },
  {
    id: 3,
    name: 'Premium Hickory',
    description: 'Intense heat and a distinct, pleasant aroma. Ideal for both heating and cooking.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1520114878144-6123749968dd?auto=format&fit=crop&q=80&w=800',
    tag: 'Premium Choice',
    prompt: 'premium hickory firewood logs, dense wood texture, professional stack',
  },
];

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

export default function Products({ onAddToCart }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [generating, setGenerating] = useState<Record<number, boolean>>({});

  const handleGenerateImage = async (id: number, prompt: string) => {
    setGenerating(prev => ({ ...prev, [id]: true }));
    const newImage = await generateProductImage(prompt);
    if (newImage) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, image: newImage } : p));
    }
    setGenerating(prev => ({ ...prev, [id]: false }));
  };

  return (
    <section id="products" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-widest mb-4">
              <Sparkles size={16} />
              <span>AI Enhanced Visuals</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
              Our Firewood Selection
            </h2>
            <p className="text-lg text-stone-600">
              Choose from our curated selection of premium hardwoods. 
              You can even use our <strong>Nano Banana AI</strong> to visualize the exact wood quality.
            </p>
          </div>
          <a href="#contact" className="btn-secondary whitespace-nowrap">
            Request Custom Quote
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[2rem] overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-amber-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.tag}
                </div>
                
                {/* AI Generation Overlay */}
                <button 
                  onClick={() => handleGenerateImage(product.id, product.prompt)}
                  disabled={generating[product.id]}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg hover:bg-white transition-colors disabled:opacity-50 group/ai"
                  title="Regenerate image with Nano Banana"
                >
                  {generating[product.id] ? (
                    <Loader2 size={20} className="animate-spin text-amber-600" />
                  ) : (
                    <Sparkles size={20} className="text-amber-600 group-hover/ai:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">{product.name}</h3>
                  <span className="text-xl font-bold text-amber-900">${product.price}</span>
                </div>
                <p className="text-stone-600 mb-8 leading-relaxed h-20 overflow-hidden">
                  {product.description}
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors active:scale-95"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="w-12 h-12 border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 hover:text-amber-900 hover:border-amber-900 transition-all">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
