import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const bookingSchema = z.object({
  sessionType: z.string().min(1, 'Please select a session type'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.string().min(1, 'Please select duration'),
  notes: z.string().optional(),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  cardNumber: z.string().min(16, 'Please enter a valid card number').optional(),
  expiryDate: z.string().min(5, 'Please enter expiry date').optional(),
  cvv: z.string().min(3, 'Please enter CVV').optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const sessionTypes = [
    { id: 'travel', label: 'Travel Guidance', price: 50 },
    { id: 'examday', label: 'Travel & Stay guidance', price: 80 },
    { id: 'strategy', label: 'Travel + Stay + Exam Strategy', price: 120 }
  ];

  const durations = [
    { id: '30', label: '30 minutes', price: 50 },
    { id: '60', label: '1 hour', price: 90 },
    { id: '90', label: '1.5 hours', price: 130 }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'upi', label: 'UPI' },
    { id: 'wallet', label: 'Digital Wallet' }
  ];

  const onSubmitDetails = (data: BookingFormData) => {
    setBookingData(data);
    setStep('payment');
  };

  const onSubmitPayment = async (_data: BookingFormData) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment successful! Session booked.');
      setStep('confirmation');
    } catch (error) {
      void _data;
      void error;
      toast.error('Payment failed. Please try again.');
    }
  };

  const selectedSessionType = sessionTypes.find(type => type.id === watch('sessionType'));
  const selectedDuration = durations.find(dur => dur.id === watch('duration'));
  const totalPrice = (selectedSessionType?.price || 0) + (selectedDuration?.price || 0);

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Session Booked Successfully!
              </h1>
              <p className="text-xl text-slate-600 mb-8" style={{ fontFamily: 'Lato, sans-serif' }}>
                Your mentor will contact you soon with all the details. Get ready for a stress-free exam experience!
              </p>
              
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h3 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Session Details
                </h3>
                <div className="text-left space-y-2">
                  <p><strong>Mentor ID:</strong> {id}</p>
                  <p><strong>Session Type:</strong> {selectedSessionType?.label}</p>
                  <p><strong>Date:</strong> {bookingData.date}</p>
                  <p><strong>Time:</strong> {bookingData.time}</p>
                  <p><strong>Duration:</strong> {selectedDuration?.label}</p>
                  <p><strong>Total Paid:</strong> ₹{totalPrice}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/find-mentor')}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Book Another Session
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Book Your Session
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{ fontFamily: 'Lato, sans-serif' }}>
              Schedule your mentoring session and complete the secure payment to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                {step === 'details' && (
                  <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                        Session Details
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Session Type *
                          </label>
                          <div className="space-y-3">
                            {sessionTypes.map(type => (
                              <label key={type.id} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input
                                  {...register('sessionType')}
                                  type="radio"
                                  value={type.id}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-slate-900">{type.label}</div>
                                  <div className="text-sm text-slate-600">₹{type.price}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.sessionType && (
                            <p className="mt-1 text-sm text-red-600">{errors.sessionType.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                              Date *
                            </label>
                            <input
                              {...register('date')}
                              type="date"
                              id="date"
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            {errors.date && (
                              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">
                              Time *
                            </label>
                            <input
                              {...register('time')}
                              type="time"
                              id="time"
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            {errors.time && (
                              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                              Duration *
                            </label>
                            <select
                              {...register('duration')}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="">Select duration</option>
                              {durations.map(dur => (
                                <option key={dur.id} value={dur.id}>₹{dur.price} - {dur.label}</option>
                              ))}
                            </select>
                            {errors.duration && (
                              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            {...register('notes')}
                            id="notes"
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Any specific requirements or questions..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        Proceed to Payment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 'payment' && (
                  <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                        Payment Details
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Payment Method *
                          </label>
                          <div className="space-y-3">
                            {paymentMethods.map(method => (
                              <label key={method.id} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input
                                  {...register('paymentMethod')}
                                  type="radio"
                                  value={method.id}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div className="font-medium text-slate-900">{method.label}</div>
                              </label>
                            ))}
                          </div>
                          {errors.paymentMethod && (
                            <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                          )}
                        </div>

                        {watch('paymentMethod') === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                Card Number *
                              </label>
                              <input
                                {...register('cardNumber')}
                                type="text"
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                              {errors.cardNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-2">
                                  Expiry Date *
                                </label>
                                <input
                                  {...register('expiryDate')}
                                  type="text"
                                  id="expiryDate"
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                {errors.expiryDate && (
                                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                                )}
                              </div>

                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-2">
                                  CVV *
                                </label>
                                <input
                                  {...register('cvv')}
                                  type="text"
                                  id="cvv"
                                  placeholder="123"
                                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                {errors.cvv && (
                                  <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        className="flex-1 border border-slate-300 text-slate-700 px-6 py-4 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Back to Details
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : `Pay ₹${totalPrice}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Session Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mentor ID:</span>
                    <span className="font-medium">{id}</span>
                  </div>
                  
                  {selectedSessionType && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{selectedSessionType.label}:</span>
                      <span className="font-medium">₹{selectedSessionType.price}</span>
                    </div>
                  )}
                  
                  {selectedDuration && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{selectedDuration.label}:</span>
                      <span className="font-medium">₹{selectedDuration.price}</span>
                    </div>
                  )}
                  
                  <hr className="border-slate-200" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800" style={{ fontFamily: 'Lato, sans-serif' }}>
                    All payments are secure and processed through encrypted channels. You can reschedule or cancel up to 24 hours before the session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookSession;