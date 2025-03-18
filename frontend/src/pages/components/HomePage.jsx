import React from "react";

const HomePage = () => {
  return (
    <div>
      <section className="text-center py-20 bg-gray-50">
        <div className="text-sm text-blue-600 mb-2">
          PICT Training &amp; Placement Cell
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Your Gateway to{" "}
          <span className="text-blue-600">Career Excellence</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Connecting talented students with industry-leading opportunities to
          build the future.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Student Login
          </button>
          <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded">
            Browse Opportunities
          </button>
        </div>
      </section>
      {/* Statistics Section */}
      <section className="flex justify-center space-x-8 py-12 bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold">500+</div>
          <div className="text-gray-600">Companies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">95%</div>
          <div className="text-gray-600">Placement Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">₹36 LPA</div>
          <div className="text-gray-600">Highest Package</div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="text-gray-600">
            Our platform offers powerful tools to help students showcase their
            skills and connect with top employers.
          </p>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-blue-600 mb-4">
              <i className="fas fa-user-cog fa-2x" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Profile Management</h3>
            <p className="text-gray-600">
              Build and manage your comprehensive profile.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-blue-600 mb-4">
              <i className="fas fa-briefcase fa-2x" />
            </div>
            <h3 className="text-xl font-bold mb-2">Job Listings</h3>
            <p className="text-gray-600">
              Browse through a curated list of opportunities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-blue-600 mb-4">
              <i className="fas fa-graduation-cap fa-2x" />
            </div>
            <h3 className="text-xl font-bold mb-2">Education Tracking</h3>
            <p className="text-gray-600">
              Keep your academic credentials, certifications, and achievements
              up to date.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
