import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ExamGo
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/find-mentor" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Find Mentor
            </Link>
            <Link to="/become-mentor" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Become Mentor
            </Link>
            <Link to="/journey-together" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Journey Together
            </Link>
            <Link to="/student-signup" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Get Started
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/find-mentor" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Find Mentor
              </Link>
              <Link to="/become-mentor" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Become Mentor
              </Link>
              <Link to="/journey-together" className="text-slate-700 hover:text-emerald-600 transition-colors">
                Journey Together
              </Link>
              <Link to="/student-signup" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-block text-center">
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;