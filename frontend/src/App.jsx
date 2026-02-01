import React, { useState } from 'react'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import StudentDashboard from './pages/StudentDashboard'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  // Show dashboard if enabled
  if (showDashboard) {
    return <StudentDashboard />
  }

  const handleSwitchToSignup = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const handleSwitchToLogin = () => {
    setShowSignup(false)
    setShowLogin(true)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Hostel Complaint System</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDashboard(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                View Dashboard
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Hostel Complaint & Maintenance Tracking System
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline hostel maintenance requests and track complaints efficiently. 
            Get your issues resolved faster with our easy-to-use platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowSignup(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
            >
              Login Now
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Complaint Filing</h3>
            <p className="text-gray-600">Submit and track your maintenance requests with just a few clicks.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Response</h3>
            <p className="text-gray-600">Get real-time updates on the status of your complaints.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor all your complaints and their resolution status.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  )
}

export default App
