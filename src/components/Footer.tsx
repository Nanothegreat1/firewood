import { Flame, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-50 pt-24 pb-12 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center text-white">
                <Flame size={24} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-900">
                Premier Firewood
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Providing the highest quality kiln-dried firewood to homes and businesses since 2010. 
              Quality you can feel, warmth you can trust.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-900 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-900 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-amber-900 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Home</a></li>
              <li><a href="#products" className="text-stone-600 hover:text-amber-900 transition-colors">Our Wood</a></li>
              <li><a href="#features" className="text-stone-600 hover:text-amber-900 transition-colors">Why Choose Us</a></li>
              <li><a href="#about" className="text-stone-600 hover:text-amber-900 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-stone-600 hover:text-amber-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Products</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Kiln-Dried Oak</a></li>
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Mixed Hardwoods</a></li>
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Premium Hickory</a></li>
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Bulk Wholesale</a></li>
              <li><a href="#" className="text-stone-600 hover:text-amber-900 transition-colors">Kindling Bundles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-stone-600 mb-6">Get seasonal tips and special offers delivered to your inbox.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all"
              />
              <button className="bg-amber-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-800 transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-stone-500">
          <p>© 2026 Premier Firewood Company. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-amber-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-900 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
