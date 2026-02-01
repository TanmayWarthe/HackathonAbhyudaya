import React, { useState, useEffect } from 'react'
import { complaintsAPI, authAPI } from '../services/api'

const WardenDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, submitted: 0, inProgress: 0, resolved: 0, overdue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
  })

  useEffect(() => {
    fetchComplaints()
    fetchStats()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.getAll(filters)
      setComplaints(response.complaints)
    } catch (err) {
      console.error('Error fetching complaints:', err)
      setError('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await complaintsAPI.getStats()
      setStats(response)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'complaints', label: 'All Complaints', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700',
    }
    return styles[priority] || 'bg-gray-100 text-gray-800'
  }

  const handleAssignComplaint = async (complaintId, team, priority, deadline) => {
    try {
      await complaintsAPI.assign(complaintId, {
        assignedTo: team,
        urgency: priority,
        deadline: deadline || null
      })
      setSelectedComplaint(null)
      alert('Complaint assigned successfully!')
      fetchComplaints() // Refresh the list
    } catch (err) {
      console.error('Error assigning complaint:', err)
      alert('Failed to assign complaint')
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    if (filters.category && complaint.category !== filters.category) return false
    if (filters.priority && complaint.priority !== filters.priority) return false
    if (filters.status && complaint.status !== filters.status) return false
    return true
  })

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍💼 Warden Dashboard</h1>
            
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

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Overdue</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.overdue}
                    </p>
                  </div>
                  <div className="text-4xl">🚨</div>
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

            {/* Priority Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* High Priority */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                  <span className="mr-2">🔴</span>
                  High Priority Complaints
                </h2>
                <div className="space-y-3">
                  {complaints.filter(c => c.priority === 'high' && c.status !== 'resolved').slice(0, 3).map((complaint) => (
                    <div key={complaint.id} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">#{complaint.id} - {complaint.title}</h3>
                          <p className="text-sm text-gray-600">Room {complaint.room} • {complaint.student}</p>
                        </div>
                        <span className={`px-2 py-1 ${getStatusBadge(complaint.status)} text-xs rounded-full`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overdue Complaints */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Overdue Complaints
                </h2>
                <div className="space-y-3">
                  {complaints.filter(c => c.status === 'overdue').map((complaint) => (
                    <div key={complaint.id} className="border-l-4 border-red-700 pl-4 py-2 bg-red-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">#{complaint.id} - {complaint.title}</h3>
                          <p className="text-sm text-gray-600">Room {complaint.room} • Deadline: {complaint.deadline}</p>
                        </div>
                        <button 
                          onClick={() => { setSelectedComplaint(complaint); setActiveTab('complaints'); }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
              <div className="space-y-4">
                {complaints.slice(0, 4).map((complaint) => (
                  <div key={complaint.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">#{complaint.id} - {complaint.title}</h3>
                        <p className="text-sm text-gray-600">Room {complaint.room} • {complaint.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 ${getPriorityBadge(complaint.priority)} text-xs rounded-full font-medium`}>
                        {complaint.priority}
                      </span>
                      <span className={`px-3 py-1 ${getStatusBadge(complaint.status)} text-xs rounded-full`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('complaints')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All Complaints →
              </button>
            </div>
          </div>
        )
      
      case 'complaints':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 All Complaints</h1>
            
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Categories</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              
              {(filters.category || filters.priority || filters.status) && (
                <button
                  onClick={() => setFilters({ category: '', priority: '', status: '' })}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div 
                  key={complaint.id} 
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${
                    complaint.status === 'overdue' ? 'border-l-4 border-red-500 bg-red-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          #{complaint.id} - {complaint.title}
                        </h3>
                        {complaint.status === 'overdue' && (
                          <span className="text-red-600 font-bold text-sm">⚠️ OVERDUE</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>👤 {complaint.student}</span>
                        <span>🚪 Room {complaint.room}</span>
                        <span>📂 {complaint.category}</span>
                        <span>📅 {complaint.submittedDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-4 py-2 ${getPriorityBadge(complaint.priority)} text-sm rounded-full capitalize font-medium`}>
                        {complaint.priority} Priority
                      </span>
                      <span className={`px-4 py-2 ${getStatusBadge(complaint.status)} text-sm rounded-full capitalize font-medium`}>
                        {complaint.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {complaint.assignedTo ? (
                        <>
                          <span className="font-medium">Assigned to:</span> {complaint.assignedTo}
                          {complaint.deadline && <span className="ml-4"><span className="font-medium">Deadline:</span> {complaint.deadline}</span>}
                        </>
                      ) : (
                        <span className="text-yellow-600 font-medium">⚠️ Not assigned yet</span>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedComplaint(complaint)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      {complaint.assignedTo ? 'Update' : 'Assign & Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredComplaints.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}

            {/* Assignment Modal */}
            {selectedComplaint && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Review & Assign Complaint</h2>
                    <button 
                      onClick={() => setSelectedComplaint(null)}
                      className="text-white hover:text-gray-200 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Complaint Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        #{selectedComplaint.id} - {selectedComplaint.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{selectedComplaint.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Student:</span> {selectedComplaint.student}</div>
                        <div><span className="font-medium">Room:</span> {selectedComplaint.room}</div>
                        <div><span className="font-medium">Category:</span> {selectedComplaint.category}</div>
                        <div><span className="font-medium">Submitted:</span> {selectedComplaint.submittedDate}</div>
                      </div>
                    </div>

                    {/* Assignment Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target)
                      handleAssignComplaint(
                        selectedComplaint.id,
                        formData.get('team'),
                        formData.get('priority'),
                        formData.get('deadline')
                      )
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Assign to Maintenance Team *
                          </label>
                          <select
                            name="team"
                            defaultValue={selectedComplaint.assignedTo}
                            required
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="">Select Team</option>
                            <option value="Team A">Maintenance Team A</option>
                            <option value="Team B">Maintenance Team B</option>
                            <option value="Team C">Maintenance Team C</option>
                            <option value="Team D">Maintenance Team D</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Set Priority *
                          </label>
                          <select
                            name="priority"
                            defaultValue={selectedComplaint.priority}
                            required
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Set Deadline *
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            defaultValue={selectedComplaint.deadline}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div className="flex space-x-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setSelectedComplaint(null)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                          >
                            Assign Complaint
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'analytics':
        const categoryStats = complaints.reduce((acc, c) => {
          acc[c.category] = (acc[c.category] || 0) + 1
          return acc
        }, {})

        const priorityStats = complaints.reduce((acc, c) => {
          acc[c.priority] = (acc[c.priority] || 0) + 1
          return acc
        }, {})

        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📈 Analytics & Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category-wise Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Category-wise Breakdown</h2>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="font-bold text-gray-800">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${(count / complaints.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Priority Distribution</h2>
                <div className="space-y-4">
                  {Object.entries(priorityStats).map(([priority, count]) => (
                    <div key={priority}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700 capitalize">{priority} Priority</span>
                        <span className="font-bold text-gray-800">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            priority === 'high' ? 'bg-red-500' : 
                            priority === 'medium' ? 'bg-orange-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${(count / complaints.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeated Issues */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Repeated Issues</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div>
                      <p className="font-semibold text-gray-800">Electrical Issues</p>
                      <p className="text-sm text-gray-600">Most common in Blocks A & D</p>
                    </div>
                    <span className="text-2xl font-bold text-yellow-700">{complaints.filter(c => c.category === 'Electrical').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div>
                      <p className="font-semibold text-gray-800">Plumbing Issues</p>
                      <p className="text-sm text-gray-600">Frequent in older blocks</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">{complaints.filter(c => c.category === 'Plumbing').length}</span>
                  </div>
                </div>
              </div>

              {/* Delayed Complaints */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resolution Performance</h2>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Resolved On Time</p>
                    <p className="text-4xl font-bold text-green-700">
                      {complaints.filter(c => c.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Overdue/Delayed</p>
                    <p className="text-4xl font-bold text-red-700">
                      {complaints.filter(c => c.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary - January 2026</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Total Received</p>
                  <p className="text-3xl font-bold text-blue-600">{complaints.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {complaints.filter(c => c.status === 'in-progress' || c.status === 'assigned').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Avg Resolution Time</p>
                  <p className="text-3xl font-bold text-purple-600">4.2d</p>
                </div>
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
          <p className="text-sm text-gray-600 mt-1">Warden Dashboard</p>
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
              W
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Warden</p>
              <p className="text-xs text-gray-600">Administrator</p>
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

export default WardenDashboard
