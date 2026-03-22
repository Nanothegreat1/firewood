import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Homeowner',
    content: 'The kiln-dried oak is incredible. It lights so easily and burns for hours. I will never go back to regular seasoned wood again!',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    name: 'Michael Chen',
    role: 'Restaurant Owner',
    content: 'We use Premier Firewood for our wood-fired oven. The consistency is perfect, and the heat output is exactly what we need for our pizzas.',
    avatar: 'https://i.pravatar.cc/150?u=michael',
  },
  {
    name: 'David Thompson',
    role: 'Cabin Owner',
    content: 'Fast delivery and the wood is so clean! No bugs, no mess in the house. The delivery team was professional and placed it exactly where I wanted.',
    avatar: 'https://i.pravatar.cc/150?u=david',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg text-stone-600">
            Don't just take our word for it. Here's why thousands of customers 
            trust Premier Firewood for their heating needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 relative group hover:shadow-xl transition-all"
            >
              <div className="absolute top-6 right-10 text-stone-100 group-hover:text-amber-100 transition-colors">
                <Quote size={60} fill="currentColor" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-stone-700 text-lg leading-relaxed mb-8 relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-stone-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
