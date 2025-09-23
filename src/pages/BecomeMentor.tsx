import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, MapPin, BookOpen, Users, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const mentorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  city: z.string().min(1, 'Please enter your city'),
  examType: z.string().min(1, 'Please select your exam type'),
  examYear: z.string().min(1, 'Please select the year you took the exam'),
  supportType: z.array(z.string()).min(1, 'Please select at least one support type'),
  experience: z.string().min(1, 'Please describe your experience'),
  availability: z.string().min(1, 'Please describe your availability'),
  additionalInfo: z.string().optional()
});

type MentorFormData = z.infer<typeof mentorSchema>;

const BecomeMentor: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<MentorFormData>({
    resolver: zodResolver(mentorSchema)
  });

  const onSubmit = async (data: MentorFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mentor registration successful! We\'ll review your application and get back to you soon.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const examTypes = [
    'JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE', 'UPSC', 'SSC', 'Bank PO', 'Other'
  ];

  const supportTypes = [
    { id: 'travel', label: 'Travel & Stay Guidance', description: 'Help with routes, accommodation, local tips' },
    { id: 'examday', label: 'Exam Day Support', description: 'Morning support, directions, moral support' },
    { id: 'strategy', label: 'Exam Strategy Session', description: 'Mindset, confidence building, study tips' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Become a Mentor
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{ fontFamily: 'Lato, sans-serif' }}>
              Share your exam success story and help students navigate their own journeys. Join our community of supportive mentors.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="city"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="e.g., Delhi, Mumbai, Bangalore"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Exam Information */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                  Your Exam Experience
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="examType" className="block text-sm font-medium text-slate-700 mb-2">
                      Exam Type *
                    </label>
                    <select
                      {...register('examType')}
                      id="examType"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Select your exam</option>
                      {examTypes.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                    {errors.examType && (
                      <p className="mt-1 text-sm text-red-600">{errors.examType.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="examYear" className="block text-sm font-medium text-slate-700 mb-2">
                      Year You Took the Exam *
                    </label>
                    <select
                      {...register('examYear')}
                      id="examYear"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Select year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.examYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.examYear.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Support Type */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  How Can You Help?
                </h2>
                
                <div className="space-y-4">
                  {supportTypes.map(support => (
                    <label key={support.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        {...register('supportType')}
                        type="checkbox"
                        value={support.id}
                        className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                      />
                      <div>
                        <div className="font-medium text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {support.label}
                        </div>
                        <div className="text-sm text-slate-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                          {support.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.supportType && (
                  <p className="mt-2 text-sm text-red-600">{errors.supportType.message}</p>
                )}
              </div>

              {/* Experience and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Experience *
                  </label>
                  <textarea
                    {...register('experience')}
                    id="experience"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Tell us about your exam journey, challenges you faced, and how you overcame them..."
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-slate-700 mb-2">
                    Availability *
                  </label>
                  <textarea
                    {...register('availability')}
                    id="availability"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="When are you available to mentor? (e.g., weekends, evenings, exam seasons only...)"
                  />
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  {...register('additionalInfo')}
                  id="additionalInfo"
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Any special skills, languages you speak, or other ways you can support students..."
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Become a Mentor'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeMentor;