'use client';
import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 font-bold text-xl">
          <GraduationCap className="w-6 h-6" />
          <span>AssignHelp</span>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 font-medium">
          <Link href="/">Home</Link>
          <Link href="/Blogs">Blogs</Link>
        </nav>

        {/* Phone Numbers with flag images */}
        <div className="hidden lg:flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <img
              src="https://flagcdn.com/us.svg"
              alt="USA Flag"
              className="w-5 h-3 object-cover rounded-sm"
              loading="lazy"
            />
            <span>+1 555 123 4567</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://flagcdn.com/eu.svg"
              alt="EU Flag"
              className="w-5 h-3 object-cover rounded-sm"
              loading="lazy"
            />
            <span>+44 20 7946 0958</span>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="space-x-4 flex flex-wrap justify-center">
          <Link href="/Orderpage">
            <button className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold transition">
              Order Now
            </button>
          </Link>
          <Link href="/Loging">
            <button className="px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-blue-600 transition">
              Login
            </button>
          </Link>
          <Link href="/Register">
            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
