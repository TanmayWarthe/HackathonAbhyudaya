import React, { useState } from 'react'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📌' },
    { id: 'track', label: 'Track Complaints', icon: '📊' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  // Sample complaints data
  const complaints = [
    { id: 1001, title: 'Broken Fan', category: 'Electrical', status: 'resolved', submittedDate: 'Jan 20, 2026', lastUpdate: 'Jan 25, 2026', assignedTo: 'Maintenance Team A', rating: null },
    { id: 1002, title: 'Leaking Tap', category: 'Plumbing', status: 'in-progress', submittedDate: 'Jan 22, 2026', lastUpdate: 'Jan 28, 2026', assignedTo: 'Maintenance Team B', rating: null },
    { id: 1003, title: 'Door Lock Issue', category: 'Furniture', status: 'assigned', submittedDate: 'Jan 25, 2026', lastUpdate: 'Jan 26, 2026', assignedTo: 'Maintenance Team C', rating: null },
    { id: 1004, title: 'WiFi Not Working', category: 'Other', status: 'submitted', submittedDate: 'Jan 28, 2026', lastUpdate: 'Jan 28, 2026', assignedTo: 'Pending', rating: null },
    { id: 1005, title: 'AC Not Cooling', category: 'Electrical', status: 'resolved', submittedDate: 'Jan 15, 2026', lastUpdate: 'Jan 18, 2026', assignedTo: 'Maintenance Team A', rating: 4 },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📌 Student Dashboard</h1>
            
            {/* Quick Raise Complaint Button */}
            <div className="mb-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center space-x-2">
                <span className="text-xl">➕</span>
                <span>Raise New Complaint</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Complaints</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{complaints.length}</p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {complaints.filter(c => c.status === 'submitted').length}
                    </p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {complaints.filter(c => c.status === 'in-progress' || c.status === 'assigned').length}
                    </p>
                  </div>
                  <div className="text-4xl">⚙️</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Resolved</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {complaints.filter(c => c.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
              <div className="space-y-4">
                {complaints.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">#{complaint.id} - {complaint.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Submitted on {complaint.submittedDate}</p>
                      </div>
                      <span className={`px-3 py-1 ${getStatusBadge(complaint.status)} text-sm rounded-full capitalize`}>
                        {complaint.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('track')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All Complaints →
              </button>
            </div>
          </div>
        )
      
      case 'track':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Complaint Status & Tracking</h1>
            
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        #{complaint.id} - {complaint.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Category: {complaint.category}</p>
                    </div>
                    <span className={`px-4 py-2 ${getStatusBadge(complaint.status)} text-sm rounded-full capitalize font-medium`}>
                      {complaint.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Status Flow Timeline */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-2 ${complaint.status === 'submitted' || complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'submitted' || complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                          📝
                        </div>
                        <span className="text-xs font-medium">Submitted</span>
                      </div>
                      
                      <div className={`h-1 w-12 ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      
                      <div className={`flex items-center space-x-2 ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-purple-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                          👤
                        </div>
                        <span className="text-xs font-medium">Assigned</span>
                      </div>
                      
                      <div className={`h-1 w-12 ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      
                      <div className={`flex items-center space-x-2 ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-yellow-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-yellow-600 text-white' : 'bg-gray-300'}`}>
                          ⚙️
                        </div>
                        <span className="text-xs font-medium">In Progress</span>
                      </div>
                      
                      <div className={`h-1 w-12 ${complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      
                      <div className={`flex items-center space-x-2 ${complaint.status === 'resolved' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                          ✅
                        </div>
                        <span className="text-xs font-medium">Resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p><strong className="text-gray-700">Submitted:</strong> {complaint.submittedDate}</p>
                      <p><strong className="text-gray-700">Last Update:</strong> {complaint.lastUpdate}</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-700">Assigned To:</strong> {complaint.assignedTo}</p>
                      {complaint.status === 'resolved' && !complaint.rating && (
                        <button 
                          onClick={() => setActiveTab('feedback')}
                          className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                          Give Feedback →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'feedback':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">⭐ Feedback & Confirmation</h1>
            
            {/* Resolved complaints that need feedback */}
            <div className="space-y-6">
              {complaints
                .filter(c => c.status === 'resolved')
                .map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          #{complaint.id} - {complaint.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Resolved on {complaint.lastUpdate}
                        </p>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full">
                        ✅ Resolved
                      </span>
                    </div>

                    {!complaint.rating ? (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-4">Rate Resolution Quality</h4>
                        
                        {/* Star Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="text-3xl hover:scale-110 transition"
                            >
                              ⭐
                            </button>
                          ))}
                        </div>

                        {/* Feedback Message */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback Message (Optional)
                          </label>
                          <textarea
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Share your experience with the resolution..."
                          ></textarea>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                            Submit Feedback
                          </button>
                          <button className="flex-1 bg-red-50 text-red-600 border border-red-300 py-2 rounded-lg font-semibold hover:bg-red-100 transition">
                            Not Satisfied - Reopen Complaint
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-4 bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-medium">
                          ✅ Thank you for your feedback! Rating: {'⭐'.repeat(complaint.rating)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {complaints.filter(c => c.status === 'resolved').length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resolved Complaints</h3>
                <p className="text-gray-600">You don't have any resolved complaints to provide feedback on.</p>
              </div>
            )}
          </div>
        )
      
      case 'profile':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 My Profile</h1>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  JS
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-800">John Smith</h2>
                  <p className="text-gray-600">john.smith@example.com</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Smith"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john.smith@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                    <input
                      type="text"
                      defaultValue="Hostel A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      defaultValue="101"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )
      
      default:
        return <div>Select a menu item</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Hostel Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Student Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              JS
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">John Smith</p>
              <p className="text-xs text-gray-600">Room 101</p>
            </div>
          </div>
          <button className="w-full mt-3 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
