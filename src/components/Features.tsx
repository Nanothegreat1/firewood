import { motion } from 'motion/react';
import { Flame, Wind, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const features = [
  {
    title: 'Kiln-Dried Quality',
    description: 'Our wood is dried in high-temperature kilns to ensure a moisture content below 20%.',
    icon: Flame,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Easy to Light',
    description: 'No more struggling with damp logs. Our wood catches fire quickly and burns reliably.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Pest & Mold Free',
    description: 'The kiln-drying process eliminates insects and mold, making it safe for indoor storage.',
    icon: ShieldCheck,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Cleaner Burning',
    description: 'Less smoke, less creosote buildup in your chimney, and a much cleaner environment.',
    icon: Wind,
    color: 'bg-emerald-100 text-emerald-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
            The Premier Difference
          </h2>
          <p className="text-lg text-stone-600">
            We don't just sell wood; we provide the ultimate heating experience. 
            Our meticulous process ensures every log is perfect for your home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-xl transition-all group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                feature.color || "bg-stone-200 text-stone-700"
              )}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
