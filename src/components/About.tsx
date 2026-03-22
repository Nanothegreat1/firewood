import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549210641-546e179963e3?auto=format&fit=crop&q=80&w=1000"
                alt="Firewood logs stacked"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -right-8 bg-amber-900 text-white p-8 rounded-[2rem] shadow-2xl max-w-[240px]">
              <span className="text-4xl font-serif font-bold block mb-2">15+</span>
              <span className="text-sm font-medium text-amber-200 uppercase tracking-widest">Years of Premium Service</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8">
              A Tradition of <br />
              <span className="text-amber-600 italic">Quality & Warmth.</span>
            </h2>
            <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
              <p>
                Founded in 2010, Premier Firewood Company began with a simple mission: 
                to provide homeowners with the highest quality firewood available. 
                We realized that most "seasoned" wood was inconsistent and often too damp to burn effectively.
              </p>
              <p>
                That's why we invested in state-of-the-art kiln technology. By controlling 
                the drying process, we ensure every piece of wood we deliver meets our 
                rigorous standards for moisture content, cleanliness, and burn quality.
              </p>
              <p>
                Today, we are proud to serve thousands of families across the region, 
                helping them create warm memories around the hearth with wood that 
                burns brighter, longer, and cleaner.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-stone-900 mb-1">5k+</h4>
                <p className="text-stone-500">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-stone-900 mb-1">100%</h4>
                <p className="text-stone-500">Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
