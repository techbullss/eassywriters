'use client';
import React from 'react';

const tutors = [
  {
    name: 'Dr. Emily Stone',
    university: 'Harvard University',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    reviews: [
      'Amazing guidance on my thesis!',
      'Very patient and knowledgeable.',
      'Helped me get an A on my final paper.',
    ],
  },
  {
    name: 'Prof. Michael Lee',
    university: 'Oxford University',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    reviews: [
      'Exceptional quality work!',
      'Always delivers on time.',
      'Very professional and responsive.',
    ],
  },
  {
    name: 'Dr. Sophia Patel',
    university: 'Stanford University',
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    reviews: [
      'Great communication skills.',
      'My favorite tutor by far!',
      '5 stars every time!',
    ],
  },
];

const TutorSection = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Meet Our Top-Rated Tutors
        </h2>
        <p className="text-gray-600 text-lg">
          Trusted by 10,000+ students since 2010. Guaranteed top grades with our expert academic team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tutors.map((tutor, index) => (
          <div
            key={index}
            className="relative group bg-gray-100 rounded-lg p-6 text-center shadow-md hover:shadow-xl transition"
          >
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h4 className="font-semibold text-lg text-gray-800">{tutor.name}</h4>
            <p className="text-sm text-gray-500">{tutor.university}</p>
            <div className="flex justify-center mt-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">From 2,000+ reviews</span>

            {/* Hidden Review Panel */}
            <div className="absolute inset-0 bg-black bg-opacity-90 text-white rounded-lg p-4 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out z-10">
              <h5 className="font-semibold text-sm mb-2">What Students Say</h5>
              <ul className="text-xs space-y-1">
                {tutor.reviews.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorSection;
