import React from 'react';
import { UserPlus, Search, Calendar, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Tell us about your exam, city, and what kind of support you need - travel guidance, exam day support, or strategy sessions."
    },
    {
      icon: Search,
      title: "Find Your Guide",
      description: "Browse verified mentors who've taken exams in your city. Read their profiles, ratings, and specialties to find the perfect match."
    },
    {
      icon: Calendar,
      title: "Book Support",
      description: "Schedule your mentoring sessions - from pre-exam travel planning to morning-of exam day support. Choose what works for you."
    },
    {
      icon: Heart,
      title: "Succeed Together",
      description: "Get personalized guidance, feel supported, and ace your exam. Then consider becoming a mentor to help the next student!"
    }
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* 🌊 Contrasting Fluid Gradient Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Wave Shape Animation */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-emerald-200 via-sky-200 to-yellow-100 opacity-30"
          style={{ clipPath: "ellipse(70% 100% at 50% 50%)" }}
          animate={{
            x: [0, -50, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Second Wave Layer for depth */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-sky-300 via-emerald-200 to-yellow-200 opacity-20"
          style={{ clipPath: "ellipse(65% 95% at 50% 55%)" }}
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.03, 0.97, 1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 🌟 Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            How ExamGuide Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto" style={{ fontFamily: 'Lato, sans-serif' }}>
            Getting support for your exam journey is simple. Connect with mentors who understand exactly what you're going through.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <IconComponent className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
