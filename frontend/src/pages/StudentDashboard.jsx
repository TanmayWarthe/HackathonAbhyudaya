import React, { useState, useEffect, useCallback } from 'react'
import { complaintsAPI, authAPI } from '../services/api'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, submitted: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    urgency: 'medium',
    image: null,
  })

  const user = authAPI.getUser()

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true)
      const response = await complaintsAPI.getAll()
      setComplaints(response.complaints || [])
    } catch (err) {
      console.error('Error fetching complaints:', err)
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await complaintsAPI.getStats()
      setStats(response || { total: 0, submitted: 0, inProgress: 0, resolved: 0 })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  useEffect(() => {
    fetchComplaints()
    fetchStats()
  }, [fetchComplaints, fetchStats])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📌' },
    { id: 'raise', label: 'Raise Complaint', icon: '➕' },
    { id: 'track', label: 'Track Complaints', icon: '📊' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
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

  // Moved handleChange and handleSubmit outside of renderContent
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if description has minimum length
      if (formData.description.length < 20) {
        alert("Description must be at least 20 characters long.");
        return;
      }

      console.log("Complaint Submitted:", formData);
      
      // Call API to submit complaint
      // await complaintsAPI.create(formData);
      
      alert("Complaint submitted successfully!");
      
      // Reset form
      setFormData({
        category: '',
        description: '',
        location: '',
        urgency: 'medium',
        image: null,
      });
      setImagePreview(null);
      
      // Refresh complaints list
      await fetchComplaints();
      await fetchStats();
      
      // Go back to dashboard
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to logout. Please try again.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📌 Student Dashboard</h1>
            
            {/* Quick Raise Complaint Button */}
            <div className="mb-8">
              <button 
                onClick={() => setActiveTab('raise')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center space-x-2"
              >
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
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.submitted}
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
                      {stats.inProgress}
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
                      {stats.resolved}
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : complaints.length === 0 ? (
                <p className="text-gray-600">No complaints yet. Click 'Raise Complaint' to submit one.</p>
              ) : (
                <div className="space-y-4">
                  {complaints.slice(0, 3).map((complaint) => (
                    <div key={complaint.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">#{complaint.id} - {complaint.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Submitted on {new Date(complaint.created_at || complaint.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 ${getStatusBadge(complaint.status)} text-sm rounded-full capitalize`}>
                          {complaint.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {complaints.length > 3 && (
                <button 
                  onClick={() => setActiveTab('track')}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Complaints →
                </button>
              )}
            </div>
          </div>
        )
      
      case 'raise':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">➕ Raise a Complaint</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <p className="text-white">Fill in the details below to submit your maintenance request</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Category and Urgency Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Complaint Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🏷️</span>
                        Complaint Category *
                      </span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Category</option>
                      <option value="Plumbing">🚰 Plumbing</option>
                      <option value="Electrical">⚡ Electrical</option>
                      <option value="Furniture">🪑 Furniture</option>
                      <option value="Cleanliness">🧹 Cleanliness</option>
                      <option value="Internet">📡 Internet/WiFi</option>
                      <option value="Other">📋 Other</option>
                    </select>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🚨</span>
                        Urgency Level *
                      </span>
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="low">🟢 Low - Can wait a few days</option>
                      <option value="medium">🟡 Medium - Within 1-2 days</option>
                      <option value="high">🔴 High - Urgent attention needed</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📍</span>
                      Specific Location *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Room 101, Common Bathroom, Study Hall"
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📄</span>
                      Detailed Description *
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                    placeholder="Please describe the issue in detail. Include any relevant information that will help us resolve it quickly..."
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum 20 characters required</p>
                  {formData.description.length < 20 && formData.description.length > 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      {20 - formData.description.length} more characters required
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📷</span>
                      Upload Image (Optional)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-48 mx-auto rounded-lg shadow-md"
                          />
                          <p className="text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-5xl">📸</div>
                          <p className="text-gray-600 font-medium">Click to upload an image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-200 border-2 border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formData.description.length < 20}
                    className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl ${
                      formData.description.length < 20 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Quick Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be as specific as possible about the issue</li>
                    <li>• Include the exact location for faster response</li>
                    <li>• Upload a photo if it helps explain the problem</li>
                    <li>• You'll receive updates via email and dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'track':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Complaint Status & Tracking</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Loading complaints...</p>
                </div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any complaints yet.</p>
                <button 
                  onClick={() => setActiveTab('raise')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Raise Your First Complaint
                </button>
              </div>
            ) : (
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
                      <div className="flex items-center justify-between">
                        <div className={`flex flex-col items-center ${complaint.status === 'submitted' || complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-blue-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'submitted' || complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                            📝
                          </div>
                          <span className="text-xs font-medium mt-1">Submitted</span>
                        </div>
                        
                        <div className={`h-1 flex-1 mx-2 ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        
                        <div className={`flex flex-col items-center ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-purple-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'assigned' || complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                            👤
                          </div>
                          <span className="text-xs font-medium mt-1">Assigned</span>
                        </div>
                        
                        <div className={`h-1 flex-1 mx-2 ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        
                        <div className={`flex flex-col items-center ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'text-yellow-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'in-progress' || complaint.status === 'resolved' ? 'bg-yellow-600 text-white' : 'bg-gray-300'}`}>
                            ⚙️
                          </div>
                          <span className="text-xs font-medium mt-1">In Progress</span>
                        </div>
                        
                        <div className={`h-1 flex-1 mx-2 ${complaint.status === 'resolved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        
                        <div className={`flex flex-col items-center ${complaint.status === 'resolved' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${complaint.status === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                            ✅
                          </div>
                          <span className="text-xs font-medium mt-1">Resolved</span>
                        </div>
                      </div>
                    </div>

                    {/* Complaint Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p><strong className="text-gray-700">Submitted:</strong> {complaint.submittedDate || new Date(complaint.created_at).toLocaleDateString()}</p>
                        <p><strong className="text-gray-700">Last Update:</strong> {complaint.lastUpdate || 'No updates yet'}</p>
                      </div>
                      <div>
                        <p><strong className="text-gray-700">Assigned To:</strong> {complaint.assignedTo || 'Not assigned yet'}</p>
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
            )}
          </div>
        )
      
      case 'feedback': {
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">⭐ Feedback & Confirmation</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : resolvedComplaints.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resolved Complaints</h3>
                <p className="text-gray-600">You don't have any resolved complaints to provide feedback on.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {resolvedComplaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          #{complaint.id} - {complaint.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Resolved on {complaint.lastUpdate || 'Recently'}
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
            )}
          </div>
        )
      }
      
      case 'profile':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 My Profile</h1>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
                  <p className="text-gray-600">{user?.email || 'No email provided'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                    <input
                      type="text"
                      defaultValue={user?.hostel || 'Hostel A'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      defaultValue={user?.room || '101'}
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
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Hostel Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Student Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-grow">
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
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-600">Room {user?.room || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
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