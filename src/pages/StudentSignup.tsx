// Top-level font injector: runs on module import to minimize FOUT and enforce SK Modernist globally.
(function initSKModernist() {
	// ...safe-guard for non-browser environments...
	if (typeof document === 'undefined') return;
	try {
		const fontHref = 'https://fonts.cdnfonts.com/css/sk-modernist';
		// preconnect (once)
		if (!document.getElementById('sk-modernist-preconnect')) {
			const pre = document.createElement('link');
			pre.id = 'sk-modernist-preconnect';
			pre.rel = 'preconnect';
			pre.href = 'https://fonts.cdnfonts.com';
			pre.crossOrigin = '';
			document.head.appendChild(pre);
		}
		// inline style with @import + global !important rule (once)
		if (!document.getElementById('sk-modernist-global-style')) {
			const style = document.createElement('style');
			style.id = 'sk-modernist-global-style';
			style.innerHTML = `
				@import url('${fontHref}');
				/* Force SK Modernist across the app; !important ensures it overrides inline/component fonts */
				html, body, * { font-family: 'SK Modernist', sans-serif !important; }
			`;
			document.head.appendChild(style);
		}
		// add stylesheet link as a fallback so the font file is fetched by all browsers (once)
		if (!document.getElementById('sk-modernist-link')) {
			const link = document.createElement('link');
			link.id = 'sk-modernist-link';
			link.rel = 'stylesheet';
			link.href = fontHref;
			document.head.appendChild(link);
		}
	} catch {
		/* noop: silently ignore in non-browser or if injection fails */
	}
})();

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, MapPin, BookOpen, Users, Home, Plane } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationSearch, { type LocationSelection } from '../components/LocationSearch';
import { useAuth } from '../context/auth';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  examType: z.literal('NDA', { errorMap: () => ({ message: 'Only NDA is currently available' }) }),
  examCity: z.string().min(1, 'Please enter your exam city'),
  examDate: z.string().min(1, 'Please select your exam date'),
  examCenterAddress: z.string().min(1, 'Please enter your exam center address'),
  // Required by type, with a default from RHF defaultValues
  supportType: z.array(z.string()),
  hotelPriceRange: z.string().optional(),
  travelMode: z.array(z.string()).optional(),
  travelPreference: z.array(z.string()).optional(),
  // Optional admit card upload: PDF/JPG/PNG up to 5MB (validates only when provided)
  admitCard: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0] instanceof File,
      'Invalid file upload'
    )
    .refine(
      (files) => {
        const file: File | undefined = files?.[0];
        if (!file) return true; // optional: allow empty
        return file.size <= 5 * 1024 * 1024; // 5MB
      },
      'File size must be 5MB or less'
    )
    .refine(
      (files) => {
        const file: File | undefined = files?.[0];
        if (!file) return true; // optional: allow empty
        const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
        return allowed.includes(file.type);
      },
      'Only PDF, PNG, or JPG files are allowed'
    ),
  additionalInfo: z.string().optional()
});

type StudentFormData = z.infer<typeof studentSchema>;

const StudentSignup: React.FC = () => {
  const navigate = useNavigate();
  const { user, emailVerified, sendMagicLink, sendVerificationEmail } = useAuth();
  const [sending, setSending] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      supportType: [],
      travelMode: [],
      travelPreference: []
    }
  });

  const watchedSupportTypes = watch('supportType') || [];
  const [examCitySelection, setExamCitySelection] = useState<LocationSelection | null>(null);

  // No password linking required; sign-in link verification is sufficient

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (!user) {
        toast.error('Please verify your email first.');
        return;
      }
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'admitCard') return; // handle separately
        if (Array.isArray(v)) v.forEach((vv) => fd.append(k, String(vv)));
        else if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      fd.append('uid', user.uid);
      const file = (data as any).admitCard?.[0];
      if (file) fd.append('admitCard', file);

      const res = await axios.post(`${BACKEND}/api/students/signup`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data?.ok) {
        toast.success('Registration successful! Redirecting to find Guide...');
        setTimeout(() => navigate('/find-mentor'), 1200);
      } else {
        toast.error('Submission failed.');
      }
    } catch (error:any) {
      toast.error(error?.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const requestVerify = async (email: string) => {
    setSending(true);
    try {
      // If user is already verified, do nothing but notify
      if (emailVerified) {
        toast.success('Email already verified');
        return;
      }
      // If signed in, send verification email; otherwise use magic link sign-in flow
      if (user) {
        await sendVerificationEmail();
        toast.info('Verification email sent. Check your inbox.');
      } else {
        await sendMagicLink(email);
        toast.info('Sign-in link sent. Check your inbox to verify.');
      }
    } finally { setSending(false); }
  };

  // Removed password creation flow

  const examOptions: { value: string; label: string; enabled: boolean }[] = [
    { value: 'NDA', label: 'NDA', enabled: true },
    { value: 'JEE Main', label: 'JEE Main (Coming soon)', enabled: false },
    { value: 'JEE Advanced', label: 'JEE Advanced (Coming soon)', enabled: false },
    { value: 'NEET', label: 'NEET (Coming soon)', enabled: false },
    { value: 'CAT', label: 'CAT (Coming soon)', enabled: false },
    { value: 'GATE', label: 'GATE (Coming soon)', enabled: false },
    { value: 'UPSC', label: 'UPSC (Coming soon)', enabled: false },
    { value: 'SSC', label: 'SSC (Coming soon)', enabled: false },
    { value: 'Bank PO', label: 'Bank PO (Coming soon)', enabled: false },
    { value: 'Other', label: 'Other (Coming soon)', enabled: false },
  ];

  // const supportTypes = [
  //   { id: 'travel', label: 'Travel Guidance', description: 'Help with routes, local tips' },
  //   { id: 'examday', label: 'Travel & Stay guidance', description: 'Help with routes, accomodation and local tips in one place!' },
  //   // { id: 'strategy', label: 'Travel+ Stay+ Exam-Strategy', description: 'Mindset, confidence building, study tipsroutes, accomodation and local tips everything at your fingertips!' }
  // ];

  const hotelPriceRanges = [
    { value: 'budget', label: 'Budget (₹500-₹1,500/night)', description: 'Basic accommodation with essential amenities' },
    { value: 'mid-range', label: 'Mid-Range (₹1,500-₹3,500/night)', description: 'Comfortable stay with good amenities' },
    { value: 'premium', label: 'Premium (₹3,500-₹7,000/night)', description: 'Luxury accommodation with premium services' },
    { value: 'luxury', label: 'Luxury (₹7,000+/night)', description: 'High-end hotels with exceptional services' }
  ];

  const travelModes = [
    { id: 'bus', label: 'Bus', description: 'Economical travel option' },
    { id: 'train', label: 'Train', description: 'Comfortable and reliable' },
    { id: 'airways', label: 'Airways', description: 'Fastest travel option' }
  ];

  const travelPreferences = [
    { id: 'shared-transport', label: 'Shared Transportation', description: 'Share taxi, cab, or private vehicle to exam center' },
    { id: 'public-transport', label: 'Public Transport', description: 'Travel together via bus, train, or metro' },
    { id: 'early-departure', label: 'Early Departure', description: 'Prefer to leave early to avoid rush and reach on time' },
    // { id: 'safety-companion', label: 'Safety Companion', description: 'Travel together for safety, especially for early morning exams' },
    { id: 'cost-sharing', label: 'Cost Sharing', description: 'Share travel expenses like taxi fare or fuel costs' }
  ];

  // Check if exam day support or strategy session is selected
  const needsTravelInfo = watchedSupportTypes?.includes('examday') || watchedSupportTypes?.includes('strategy');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Find Your Perfect Guide
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tell us about your exam and what support you need. We'll connect you with experienced guide in your city.
            </p>
            <p className="mt-4 text-lg text-slate-800">
              Already have an account? <a className="text-emerald-700 font-semibold underline hover:text-emerald-800" href="/#/signin">Sign in</a>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
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
                    <div className="flex gap-2">
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                      <button
                        type="button"
                        onClick={() => requestVerify(watch('email'))}
                        disabled={sending}
                        className={`shrink-0 px-4 py-3 rounded-lg border ${emailVerified ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'} disabled:opacity-50`}
                      >
                        {emailVerified ? 'Verified' : (sending ? 'Sending…' : 'Verify')}
                      </button>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                    {emailVerified && (
                      <p className="mt-1 text-xs text-emerald-700">Email verified ✓</p>
                    )}
                  </div>
                {/* Password creation removed */}

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
                </div>
              </div>

              {/* Exam Information */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                  Exam Details
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
                      {examOptions.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={!opt.enabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.examType && (
                      <p className="mt-1 text-sm text-red-600">{errors.examType.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="examCity" className="block text-sm font-medium text-slate-700 mb-2">
                      Exam City *
                    </label>
                    {/* Hidden input registered with RHF holds the selected address */}
                    <input type="hidden" id="examCity" {...register('examCity')} readOnly />
                    <LocationSearch
                      value={examCitySelection}
                      onSelect={(loc) => {
                        setExamCitySelection(loc);
                        setValue('examCity', loc.address, { shouldValidate: true, shouldDirty: true });
                      }}
                      placeholder="Search and select your exam city"
                      className=""
                    />
                    {errors.examCity ? (
                      <p className="mt-1 text-sm text-red-600">{errors.examCity.message}</p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">Please select from the dropdown so we can capture accurate city details.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="examDate" className="block text-sm font-medium text-slate-700 mb-2">
                      Exam Date *
                    </label>
                    <input
                      {...register('examDate')}
                      type="date"
                      id="examDate"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                    {errors.examDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.examDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="examCenterAddress" className="block text-sm font-medium text-slate-700 mb-2">
                      Exam Center Address *
                    </label>
                    <input
                      {...register('examCenterAddress')}
                      type="text"
                      id="examCenterAddress"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="e.g., ABC College, 123 Main Street, Sector 15"
                    />
                    {errors.examCenterAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.examCenterAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Support Type */}
              {/* <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  What Support Do You Need?
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
                        <div className="font-medium text-slate-900">
                          {support.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {support.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.supportType && (
                  <p className="mt-2 text-sm text-red-600">{errors.supportType.message}</p>
                )}
              </div> */}

              {/* Conditional Travel Information */}
              {needsTravelInfo && (
                <>
                  {/* Hotel Price Range */}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                      <Home className="h-5 w-5 mr-2 text-emerald-600" />
                      Accommodation Preference
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        Hotel Price Range (Optional)
                      </label>
                      <div className="space-y-3">
                        {hotelPriceRanges.map(range => (
                          <label key={range.value} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                            <input
                              {...register('hotelPriceRange')}
                              type="radio"
                              value={range.value}
                              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <div>
                              <div className="font-medium text-slate-900">
                                {range.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {range.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Travel Mode */}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-emerald-600" />
                      Travel Mode
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        Preferred Travel Mode (Optional)
                      </label>
                      <div className="space-y-3">
                        {travelModes.map(mode => (
                          <label key={mode.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                            <input
                              {...register('travelMode')}
                              type="checkbox"
                              value={mode.id}
                              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                            />
                            <div>
                              <div className="font-medium text-slate-900">
                                {mode.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {mode.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Travel Preferences */}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                      Travel Preferences
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        How would you like to travel? (Optional)
                      </label>
                      <div className="space-y-3">
                        {travelPreferences.map(preference => (
                          <label key={preference.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                            <input
                              {...register('travelPreference')}
                              type="checkbox"
                              value={preference.id}
                              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                            />
                            <div>
                              <div className="font-medium text-slate-900">
                                {preference.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {preference.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Admit Card Upload (Optional) */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  Upload Admit Card (Optional)
                </h2>
                <label htmlFor="admitCard" className="block text-sm font-medium text-slate-700 mb-2">
                  File (PDF, JPG, or PNG, max 5MB)
                </label>
                <input
                  {...register('admitCard')}
                  type="file"
                  id="admitCard"
                  accept="application/pdf,image/png,image/jpeg"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {errors.admitCard && (
                  <p className="mt-1 text-sm text-red-600">{String(errors.admitCard.message)}</p>
                )}
                {!errors.admitCard && (
                  <p className="mt-2 text-xs text-slate-500">
                    Optional: Uploading your admit card helps the guide verify exam details and provide better assistance.
                  </p>
                )}
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
                  placeholder="Any specific concerns, requirements, or questions you'd like to share with potential Guide..."
                />
              </div>

              {/* Password setup removed */}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !user || !emailVerified}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting…' : (!user ? 'Verify Email to Continue' : (!emailVerified ? 'Verify Email' : 'Create Account'))}
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

export default StudentSignup;
