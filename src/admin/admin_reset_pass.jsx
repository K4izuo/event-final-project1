import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    submitted: false,
    error: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({
        submitted: false,
        error: 'Please enter your email address'
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus({
        submitted: false,
        error: 'Please enter a valid email address'
      });
      return;
    }
    // Simulate successful submission
    setStatus({
      submitted: true,
      error: null
    });
    // Here you would typically make an API call to handle the password reset
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center bg-gradient-to-r from-pink-50 to-blue-50">
      <div className="w-96 max-w-md p-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center">
            {/* <svg
              className="w-8 h-8 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg> */}
            <span className="ml-2 text-xl font-semibold text-gray-800">Reset</span>
          </div>
        </div>

        {!status.submitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Forgot your password?</h2>
              <p className="mt-2 text-sm text-gray-600">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-base font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus({ submitted: false, error: null });
                  }}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    status.error ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {status.error && (
                  <p className="mt-1 text-xs text-red-500">{status.error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset password
              </button>

              <div className="text-center">
                {/* <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Back to sign in
                </a> */}
                <Link to="/" className="text-sm text-gray-600 hover:underline hover:text-black">
                Back to log in
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-green-500"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent password reset instructions to:<br/>
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <button
              onClick={() => {
                setEmail('');
                setStatus({ submitted: false, error: null });
              }}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Send new reset link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;