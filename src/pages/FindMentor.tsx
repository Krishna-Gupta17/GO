import React, { useState } from 'react';
import { Star, MapPin, Filter, Heart, Shield, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FindMentor: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const mentors = [
    {
      id: 1,
      name: "Anchal Patel",
      image:'/Anchal.jpeg',
      rating: 4.0,
      reviewCount: 17,
      city: "Delhi",
      exams: ["JEE Main", "JEE Advanced"],
      year: "2024",
      tags: [ "Local transport expert", "Knows safe eateries"],
      intro: "I understand exam stress! I'll help you navigate Delhi like a local and keep you calm on exam day.",
      verified: true,
      responseTime: "2 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
    {
      id: 2,
      name: "Priyanshu Yadav",
      image: '/Priyanshu.jpeg',
      rating: 4.8,
      reviewCount: 32,
      city: "Pune",
      exams: ["JEE Mains","JEE Advanced"],
      year: "2024",
      tags: ["Accommodation expert", "Budget-friendly tips", "Motivational"],
      intro: "From finding the perfect stay to exam day motivation - I've got your back throughout your Pune journey!",
      verified: true,
      responseTime: "1 hour",
      supportTypes: ["Travel & Stay", "Strategy Session"]
    },
    {
      id: 3,
      name: "Rashi Ashish Shrivastava",
      image:'/Rashi.jpeg',
      rating: 5.0,
      reviewCount: 28,
      city: "Bangalore",
      exams: ["CAT", "XAT"],
      year: "2023",
      tags: ["Traffic navigation", "Tech-savvy", "Quick responder"],
      intro: "Bangalore traffic can be tricky! I'll share the best routes and timing to reach your center stress-free.",
      verified: true,
      responseTime: "30 mins",
      supportTypes: ["Travel & Stay", "Exam Day Support"]
    },
    {
      id: 4,
      name: "Ayush Dixit",
      image: '/Ayush.jpeg',
      rating: 4.7,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["NDA","SSB","JEE Mains", "JEE Advanced"],
      year: "2022",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
    {
      id: 5,
      name: "Krishna Gupta",
      image: '/Krishna.jpeg',
      rating: 4.7,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["JEE Mains", "JEE Advanced","CUET UG"],
      year: "2024",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
    {
      id: 6,
      name: "Deepak Raj",
      image: '/Deepak.jpeg',
      rating: 4.1,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["NDA", "WBJEE", "JEE Mains", "JEE Advanced"],
      year: "2024",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
     {
      id: 7,
      name: "Abhishek Singh",
      image: '/Abhishek.jpeg',
      rating: 4.1,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["JEE Mains", "JEE Advanced"],
      year: "2024",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
    {
      id: 8,
      name: "Ankit Yadav",
      image: '/Ankit.jpeg',
      rating: 4.1,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["GATE", "CAT","SSB"],
      year: "2022",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    },
    {
      id: 9,
      name: "Ananya Pandey",
      image: '/Ananya.jpeg',
      rating: 4.1,
      reviewCount: 41,
      city: "Mumbai",
      exams: ["NEET"],
      year: "2024",
      tags: ["Local trains expert", "Budget accommodation", "Study spots"],
      intro: "Mumbai local trains can be overwhelming. I'll teach you the routes and share hidden study-friendly cafes!",
      verified: true,
      responseTime: "3 hours",
      supportTypes: ["Travel & Stay", "Exam Day Support", "Strategy Session"]
    }
  ];

  const cities = ["All Cities", "Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];
  const exams = ["All Exams", "NDA"];

  const filteredMentors = mentors.filter(mentor => {
    const cityMatch = !selectedCity || selectedCity === "All Cities" || mentor.city === selectedCity;
  const examMatch = !selectedExam || selectedExam === "All Exams" || mentor.exams.includes(selectedExam);
    return cityMatch && examMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Find Your Perfect Guide
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto" style={{ fontFamily: 'Lato, sans-serif' }}>
              Connect with experienced guides who've successfully navigated exams in your city. Get personalized guidance and support.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Filter Guides
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="exam" className="block text-sm font-medium text-slate-700 mb-2">
                  Exam Type
                </label>
                <select
                  id="exam"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {exams.map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors.map(mentor => (
              <div key={mentor.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {mentor.name}
                        </h3>
                        {mentor.verified && (
                          <Shield className="h-4 w-4 text-emerald-600 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">
                          {mentor.rating} ({mentor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-slate-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mentor.city} • {mentor.exams.join(', ')} ({mentor.year})
                </div>

                <div className="flex items-center text-sm text-slate-600 mb-4">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Responds in {mentor.responseTime}
                </div>

                <p className="text-slate-700 mb-4 text-sm leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {mentor.intro}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.tags.map(tag => (
                    <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-600 mb-2">Offers:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.supportTypes.map(type => (
                      <span key={type} className="bg-sky-50 text-sky-700 px-2 py-1 rounded text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/mentor/${mentor.id}/book`}
                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-center text-sm"
                  >
                    Book Session
                  </Link>
                  <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    <Heart className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                No Guides found for your selected filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FindMentor;