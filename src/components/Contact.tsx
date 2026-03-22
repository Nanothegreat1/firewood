import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  woodType: string;
  quantity: string;
  message: string;
};

export default function Contact() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert('Thank you for your inquiry! We will contact you shortly.');
  };

  return (
    <section id="contact" className="py-24 bg-stone-900 text-white overflow-hidden relative">
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
              Ready to Get <br />
              <span className="text-amber-400 italic">Warm & Cozy?</span>
            </h2>
            <p className="text-stone-400 text-lg mb-12 max-w-md">
              Fill out the form to request a delivery or ask a question. 
              Our team typically responds within 2 hours during business hours.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Call Us Directly</h4>
                  <p className="text-stone-400">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email Support</h4>
                  <p className="text-stone-400">hello@premierfirewood.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Delivery Area</h4>
                  <p className="text-stone-400">Serving the Greater Metro Area & Surrounding Counties</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Business Hours</h4>
                  <p className="text-stone-400">Mon - Sat: 8am - 6pm</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 text-stone-900 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Full Name</label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Email Address</label>
                  <input
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Wood Type</label>
                  <select
                    {...register('woodType')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all appearance-none"
                  >
                    <option>Kiln-Dried Oak</option>
                    <option>Mixed Hardwoods</option>
                    <option>Premium Hickory</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Quantity</label>
                  <select
                    {...register('quantity')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all appearance-none"
                  >
                    <option>Full Cord</option>
                    <option>Half Cord</option>
                    <option>Face Cord</option>
                    <option>Bulk/Wholesale</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Message / Delivery Notes</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-all"
                  placeholder="Tell us about your delivery needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-800 transition-all shadow-lg active:scale-95"
              >
                <Send size={20} />
                Send Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
