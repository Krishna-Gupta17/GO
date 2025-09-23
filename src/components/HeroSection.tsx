import React from 'react';
import { ArrowRight, Users, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-sky-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Exam Journey,{' '}
              <span className="text-emerald-600">Supported</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
              Connect with experienced mentors who've been where you're going. Get personalized guidance for exam travel, 
              accommodation, and day-of support from a caring community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/student-signup"
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center group"
              >
                Find a Local Mentor
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/become-mentor"
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
              >
                Become a Mentor
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>2,500+</p>
                <p className="text-slate-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Students Helped</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>98%</p>
                <p className="text-slate-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Success Rate</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>4.9/5</p>
                <p className="text-slate-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Students studying together in a supportive environment"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <p className="text-sm text-slate-600 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                "My mentor made exam day stress-free!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Student testimonial"
                  className="w-8 h-8 rounded-full mr-2"
                  loading="lazy"
                />
                <span className="text-sm font-medium text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Priya S.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;