'use client';
import { ShieldCheck, Star, Clock, ThumbsUp, Lock, FileCheck2 } from "lucide-react";

import { useState } from 'react';
import { CheckCircle } from "lucide-react";
import { FaBook, FaFileAlt, FaGraduationCap, FaClipboardList, FaPenFancy } from 'react-icons/fa';
export default function Home() {
  const [level, setLevel] = useState('highschool');
  const [urgency, setUrgency] = useState('7');
  const [pages, setPages] = useState(1);
  const [price, setPrice] = useState(0);
  const achievements = [
  {
    title: "5000+ Academic Writers",
    description:
      "Discover top experts from all academic fields ready to tackle any type of assignment you want.",
  },
  {
    title: "10+ Years of Experience",
    description:
      "Our decade-long experience in this industry allows us to solve students’ problems within seconds.",
  },
  {
    title: "100+ Subjects Covered",
    description:
      "We cover all types of subjects, from English to programming. Master all subjects under our SMEs.",
  },
  {
    title: "23K+ Orders Delivered",
    description:
      "We have a 99% success rate in delivering essays, research papers, and all types of assignments.",
  },
  {
    title: "High-End Academic Tools",
    description:
      "Enjoy free access to plagiarism checkers and more tools you need to submit a perfect assignment.",
  },
  {
    title: "100% Customer Satisfaction",
    description:
      "Our client-centric approach allows us to offer personalized services for complete satisfaction.",
  },
];

const advantages = [
  {
    icon: FileCheck2,
    title: "100% Plagiarism-Free",
    description:
      "Our experts research a topic and write the assignment from scratch to maintain its originality.",
  },
  {
    icon: ShieldCheck,
    title: "Zero AI Usage",
    description:
      "We strictly avoid using AI to write assignments. Our papers are written by exceptional scholars.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "Our writers have a writing speed of more than 60 WPM, allowing them to meet tight deadlines.",
  },
  {
    icon: Star,
    title: "24/7 Support",
    description:
      "Connect with us whenever you want. Our team works round the clock to offer writing services.",
  },
  {
    icon: ThumbsUp,
    title: "Multiple Reworks",
    description:
      "Request our writers to make changes to your assignment without incurring any additional charges.",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    description:
      "We accept payments for your order via Apple Pay, a credit/debit card, PayPal, and more options.",
  },
];

  const calculatePrice = () => {
    let base = 0;

    if (level === 'highschool') base = 5;
    else if (level === 'bachelor') base = 7;
    else if (level === 'masters') base = 10;
    else if (level === 'phd') base = 12;
    else if (level === 'collage') base = 6;

    const urgencyMultiplier: Record<string, number> = {
      '6': 3,
      '12': 2.5,
      '1': 2,
      '3': 1.7,
      '7': 1.5,
      '14': 1.3,
      '21': 1,
      '30': 0.9,
      '90': 0.8,
      '180': 0.7,
    };

    const multiplier = urgencyMultiplier[urgency] || 1;
    const total = base * multiplier * pages;

    setPrice(total);
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center min-h-screen flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80')" }}
      >
       {/* Overlay */}
<div className="absolute inset-0 bg-black opacity-60"></div>
<div className="relative text-center px-6 max-w-3xl">
  <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-white">Master Your Academic Journey</h1>
  <p className="mb-8 text-lg text-gray-200 drop-shadow-md">
    Unlock your academic potential with guidance from top-tier tutors — real educators and experts from renowned universities with proven track records. Whether it's essays, dissertations, or research papers, our elite writers are here to help you succeed.
  </p>
  <a
    href="#services"
    className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded font-semibold transition"
  >
  Oder Now and get a coupone
  </a>
</div>

      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Essay Writing',
                desc: 'High-quality, plagiarism-free essays tailored to your topic.',
                img: 'https://images.unsplash.com/photo-1584697964154-d072d01aa9dc?auto=format&fit=crop&w=800&q=60',
              },
              {
                title: 'Dissertation Assistance',
                desc: 'Comprehensive help from proposal to final submission.',
                img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60',
              },
              {
                title: 'Research Papers',
                desc: 'In-depth research and academic writing support.',
                img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60',
              },
              {
                title: 'Coursework Help',
                desc: 'Assist with assignments and projects for various subjects.',
                img: 'https://images.unsplash.com/photo-1496317556649-f930d733eea2?auto=format&fit=crop&w=800&q=60',
              },
              {
                title: 'Lab Reports',
                desc: 'Detailed and accurate reports for your science labs.',
                img: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=60',
              },
              {
                title: 'Presentations',
                desc: 'Professional and engaging presentations prepared for you.',
                img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60',
              },
            ].map(({ title, desc, img }, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105"
              >
                <img src={img} alt={title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Academic Assignments Section */}
<section className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Best Quality Assignment Writing Services at Affordable Prices
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Enjoy professional assistance without burning a hole in your pocket.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
              Assignment Topics We Cover
            </h3>
            <ul className="grid grid-cols-2 gap-4 text-left text-gray-700 font-medium">
              {[
                "Law",
                "Mathematics",
                "Philosophy",
                "Chemistry",
                "English",
                "Medicine",
                "Accounting",
                "Physics",
                "Psychology",
              ].map((topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
              FREE Features (Worth $86.94)
            </h3>
            <ul className="space-y-3 text-gray-700 text-left">
              {[
                ["Referencing", "20.99"],
                ["Revision", "19.99"],
                ["Plagiarism Checks", "14.99"],
                ["Formatting", "12.99"],
                ["Proofreading & Editing", "10.99"],
                ["Unlimited Edits", "6.99"],
              ].map(([feature, price]) => (
                <li key={feature} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {feature}
                  </div>
                  <span className="text-gray-500 line-through">${price}</span>
                  <span className="text-green-600 font-semibold ml-2">FREE</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href="#services"
          className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 transform transition"
        >
          Get These Premium Features Today – Unlock More
        </a>
      </div>
    </section>
 <section className="bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Notable Achievements
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {achievements.map(({ title, description }) => (
            <div key={title} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Leading Advantages</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {advantages.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-start"
            >
              <Icon className="text-indigo-600 w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold text-indigo-700">{title}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
{/* Academic Assignments Section - Stylish Cards */}
<section className="py-16 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
      Academic Assignments 
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[
        { icon: <FaPenFancy className="text-indigo-600 w-8 h-8" />, title: 'Essays', desc: 'Narrative, Descriptive, Expository, Persuasive Essays' },
        { icon: <FaBook className="text-indigo-600 w-8 h-8" />, title: 'Research Papers', desc: 'In-depth research across all subjects' },
        { icon: <FaGraduationCap className="text-indigo-600 w-8 h-8" />, title: 'Dissertations & Theses', desc: 'Master’s & PhD level writing support' },
        { icon: <FaClipboardList className="text-indigo-600 w-8 h-8" />, title: 'Case Studies', desc: 'Detailed analysis for real-world problems' },
        { icon: <FaFileAlt className="text-indigo-600 w-8 h-8" />, title: 'Coursework & Assignments', desc: 'Timely help with all your schoolwork' },
        { icon: <FaPenFancy className="text-indigo-600 w-8 h-8" />, title: 'Lab Reports', desc: 'Clear, concise scientific reporting' },
        { icon: <FaBook className="text-indigo-600 w-8 h-8" />, title: 'Literature Reviews', desc: 'Comprehensive critical overviews' },
        { icon: <FaGraduationCap className="text-indigo-600 w-8 h-8" />, title: 'Presentation Preparation', desc: 'Engaging slides and speaking notes' },
        { icon: <FaClipboardList className="text-indigo-600 w-8 h-8" />, title: 'Annotated Bibliographies', desc: 'Thorough citation and summaries' },
      ].map(({ icon, title, desc }, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="bg-white py-16 px-6 text-center">
  {/* Highlight Section */}
  <div className="max-w-4xl mx-auto mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      10,000+ Orders Completed Since 2010
    </h2>
    <p className="text-lg text-gray-600">
      Trusted by students worldwide — we guarantee top grades and academic excellence.
    </p>
  </div>

  {/* Top Tutors Showcase */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[1, 2, 3].map((tutor, index) => (
      <div key={index} className="bg-gray-50 shadow-lg p-6 rounded-lg">
        <img
          src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${30 + index}.jpg`}
          alt="Top Tutor"
          className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
        />
        <h3 className="text-xl font-semibold text-gray-800">Dr. Jane Doe</h3>
        <p className="text-sm text-gray-500">PhD in Literature - Harvard University</p>
        <div className="flex items-center justify-center mt-3 space-x-1">
          {Array(5).fill(0).map((_, i) => (
            <img
              key={i}
              src="https://img.icons8.com/fluency/20/star.png"
              alt="Star"
              className="h-5 w-5"
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">(2,000+ Reviews)</span>
        </div>
      </div>
    ))}
  </div>
</section>


{/* Testimonials Section */}
<section className="py-16 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Students Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          name: 'Emily R.',
          course: 'Master’s in Psychology',
          photo: 'https://randomuser.me/api/portraits/women/68.jpg',
          text: "The dissertation help I received was outstanding! The team was professional, and my paper was top-notch. I passed with distinction.",
        },
        {
          name: 'James K.',
          course: 'High School Senior',
          photo: 'https://randomuser.me/api/portraits/men/75.jpg',
          text: "I struggled with essays before, but now I get them done on time with great grades. Highly recommend their service!",
        },
        {
          name: 'Sofia M.',
          course: 'PhD Candidate, Biology',
          photo: 'https://randomuser.me/api/portraits/women/65.jpg',
          text: "Their research paper support saved me during my toughest semester. Thorough, reliable, and easy to work with.",
        },
      ].map(({ name, course, photo, text }, i) => (
        <div
          key={i}
          className="bg-gray-50 rounded-lg p-6 shadow-md flex flex-col items-center text-center"
        >
          <img
            src={photo}
            alt={name}
            className="w-24 h-24 rounded-full mb-4 object-cover shadow-sm"
            loading="lazy"
          />
          <p className="text-gray-700 italic mb-4">“{text}”</p>
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{course}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Cost Calculator */}
      <section className="py-16 bg-blue-50">
  <div className="max-w-4xl mx-auto px-6 rounded-lg shadow-lg bg-white p-10">
    <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">📊 Calculate Your Cost</h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* College Level */}
      <div>
        <label htmlFor="level" className="block font-medium mb-2"> Level</label>
        <select
          id="level"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="highschool">High School</option>
          <option value="collage">Collage</option>
          <option value="bachelor">Bachelor</option>
          <option value="masters">Master’s</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="urgency" className="block font-medium mb-2">Deadline</label>
        <select
          id="urgency"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          <option value="6">6 Hours</option>
          <option value="12">12 Hours</option>
          <option value="1">1 Day</option>
          <option value="3">3 Days</option>
          <option value="7">7 Days</option>
          <option value="14">14 Days</option>
          <option value="21">21 Days</option>
          <option value="30">30 Days</option>
          <option value="90">3 Months</option>
          <option value="180">6 Months</option>
        </select>
      </div>

      {/* Pages */}
      <div>
        <label htmlFor="pages" className="block font-medium mb-2">Pages</label>
        <input
          type="number"
          min={1}
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Button */}
      <div className="flex items-end">
        <button
          onClick={calculatePrice}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Calculate Price
        </button>
      </div>
    </div>

    {/* Price Display */}
    {price > 0 && (
      <p className="mt-6 text-center text-xl font-semibold text-green-700">
        Estimated Cost: ${price.toFixed(2)}
      </p>
    )}
  </div>
</section>

    </>
  );
}
