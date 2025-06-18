import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  UserIcon, 
  EnvelopeIcon, 
  IdentificationIcon, 
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  DocumentDuplicateIcon
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

  const handleEdit = () => {
    console.log('Edit')
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
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }


  console.log(user)
  return (
    <div className="mt-[55px] ml-[60px] flex flex-row p-[50px] gap-8">
	<div className="w-[150px] h-[150px] flex flex-col items-center 
	  justify-center border border-slate-300 rounded-[50%]">
	  <UserIcon className="w-20 h-20 text-blue-500"/>
	</div>
	{editing && 
	<div className="bg-gray-400 bg-blend-soft-light w-[100%] h-[100%]">
	  Editing
	</div>}
	<div className="w-[500px] h-[240px] flex flex-col gap-4">
	  <div className="flex justify-between border-b border-b-slate-300">
	    <p className="text-gray-500">Firstname</p>
	    <p className="">{user.firstName}</p>
	  </div>
	  <div className="flex justify-between border-b border-b-slate-300">
	    <p className="text-gray-500">Lastname</p>
	    <p>{user.lastName}</p>
	  </div>
          <div className="flex justify-between border-b border-b-slate-300">
	    <p className="text-gray-500">Email</p>
	    <p>{user.email}</p>
	  </div>
	  <div className="flex justify-between border-b border-b-slate-300">
	    <p className="text-gray-500">Username</p>
	    <p>{user.username}</p>
	  </div>
	  <div className="flex justify-between">
	    <p className="text-gray-500">Joined at</p>
	    <p className="">{new Date(user.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
	  </div>
	</div>
	<div className="flex flex-col items-start gap-2">
	  <button className="flex flex-row items-center gap-[5px]  
	    px-[12px] py-[5px] rounded-[5px] border border-slate-300 hover:shadow-sm cursor-pointer"
	    onClick={handleLogout}>
	    <p>Logout</p> 
	    <ArrowRightOnRectangleIcon className="w-5 h-5"/>
	  </button>
	  <button className="flex flex-row items-center gap-[5px] 
	    px-[12px] py-[5px] rounded-[5px] border border-slate-300 hover:shadow-sm cursor-pointer"
	    onClick={() => {
	      handleEdit();
	      setEditing(true);}}>
	    <p>Edit</p>
	    <PencilIcon className="w-5 h-5"/>
	  </button>
	  <Link to="/signup" className="flex flex-row items-center gap-[5px] 
	    px-[12px] py-[5px] rounded-[5px] border border-slate-300 hover:shadow-sm">
	    <p>Create new account</p>
	    <PlusIcon className="w-5 h-5"/>
	  </Link>
	  <Link to="/myposts" className="flex flex-row items-center gap-[5px] 
	    px-[12px] py-[5px] rounded-[5px] border border-slate-300 hover:shadow-sm">
	    <p>Posts</p>
	    <DocumentDuplicateIcon className="w-5 h-5"/>
	  </Link>
	</div>
    </div>
  )
}

export default Profile
