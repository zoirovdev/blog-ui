import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserIcon, 
  EnvelopeIcon, 
  IdentificationIcon, 
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }

      const userData = await response.json()
      setUser(userData)
      setEditFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username
      })
    } catch (error) {
      console.error('Profile fetch error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveEdit = async () => {
    // This would require an update profile API endpoint
    // For now, just simulate saving
    setUser(prev => ({
      ...prev,
      ...editFormData
    }))
    setEditing(false)
    
    // You would implement the actual API call here:
    /*
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })
      // Handle response
    } catch (error) {
      console.error('Update error:', error)
    }
    */
  }

  const handleCancelEdit = () => {
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    })
    setEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-[50px]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="ml-6">
                  {editing ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="firstName"
                          value={editFormData.firstName}
                          onChange={handleEditChange}
                          className="border border-gray-300 rounded-md px-3 py-1 text-lg font-bold"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={editFormData.lastName}
                          onChange={handleEditChange}
                          className="border border-gray-300 rounded-md px-3 py-1 text-lg font-bold"
                          placeholder="Last Name"
                        />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600"
                        placeholder="Username"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Email */}
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>

              {/* User ID */}
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <IdentificationIcon className="h-4 w-4 mr-2" />
                  User ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
              </div>

              {/* Username */}
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900">@{user.username}</dd>
              </div>

              {/* Member Since */}
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Member Since
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</dd>
              </div>

              {/* Last Updated */}
              <div className="sm:col-span-2">
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/my-posts')}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            My Posts
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
