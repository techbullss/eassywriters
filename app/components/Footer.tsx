import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 mb-4">
            <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link href="/blogs" className="text-gray-300 hover:text-white">Blogs</Link></li>
            <li><Link href="/login" className="text-gray-300 hover:text-white">Login</Link></li>
            <li><Link href="/register" className="text-gray-300 hover:text-white">Register</Link></li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">We Accept</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
              <span className="text-white">Visa</span>
            </li>
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" className="h-8" />
              <span className="text-white">MasterCard</span>
            </li>
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8" />
              <span className="text-white">PayPal</span>
            </li>
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/stripe.png" alt="Stripe" className="h-8" />
              <span className="text-white">Stripe</span>
            </li>
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="American Express" className="h-8" />
              <span className="text-white">Amex</span>
            </li>
            <li className="flex items-center space-x-3">
              <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-8" />
              <span className="text-white">Apple Pay</span>
            </li>
          </ul>
        </div>

        {/* Services Offered */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">Services We Offer</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Essay Writing</li>
            <li>Dissertation Help</li>
            <li>Research Papers</li>
            <li>Homework Assistance</li>
            <li>Thesis Writing</li>
            <li>Editing & Proofreading</li>
            <li>Assignment Help</li>
          </ul>
        </div>

        {/* Contact Widget */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">Contact Us</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://flagcdn.com/us.svg"
                alt="USA Flag"
                className="w-6 h-4 rounded-sm object-cover"
                loading="lazy"
              />
              <span>+1 555 123 4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://flagcdn.com/eu.svg"
                alt="EU Flag"
                className="w-6 h-4 rounded-sm object-cover"
                loading="lazy"
              />
              <span>+44 20 7946 0958</span>
            </div>
            <address className="not-italic">
            47 W 13th St, New York, NY 10011, USA
            </address>
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80

"
              alt="California Office"
              className="w-full h-24 object-cover rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-10 text-sm">
        &copy; {new Date().getFullYear()} AssignHelp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
