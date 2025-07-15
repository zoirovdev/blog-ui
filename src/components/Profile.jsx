import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  UserIcon, 
  EnvelopeIcon,  
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  AtSymbolIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('liked')
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'


  useEffect(() => {
    fetchProfile()
    getLiked()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
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
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
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

  const updateUser = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token') // Add this
      if (!token) {
        navigate('/login')
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
	headers: {
	  "Content-Type": 'application/json',
          'Authorization': `Bearer ${token}`
	},
 	body: JSON.stringify({
	  firstName: formData.firstName,
	  lastName: formData.lastName
	})
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }			
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setUser(data)
    } catch (error) {
      console.error('Something went wrong!')
    }
  }


  const handleForm = async () => {
    await updateUser()
    setEditing(false)
  }


  const getLiked = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/liked-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })


      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setPosts(data[0]) 
    } catch (error) {
      console.error('Failed to load', error)
      setPosts([])
    }
  }

  const handleLiked = () => {
    getLiked()
  }


  const getSaved = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/saved-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setPosts(data)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }


  const handleSaved = () => {
    getSaved()
  }


  const getShared = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/shared-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })


      if(!response.ok){
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data)
    }  catch (error) {
      console.error('Failed to load')
      setPosts([])
    }
  }


  const handleShared = () => {
    getShared()
  }


  const getCommented = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/commented-posts`, {
         headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }


  const handleCommented = () => {
    getCommented()
  }


  const getRead = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/read-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }


  const handleRead = () => {
    getRead()
  }

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600">Loading...</div>
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
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

return (
  <div className="mt-8 sm:mt-12 lg:mt-[55px] mx-4 sm:mx-8 lg:ml-[60px] flex flex-col p-4 pb-10 sm:pb-8 lg:pb-4">
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-[40px]">
      {/* Profile Picture */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-[150px] lg:h-[150px] flex flex-col items-center 
        justify-center border border-slate-300 rounded-[50%] mx-auto lg:mx-0 shrink-0">
        <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-blue-500"/>
      </div>

      {/* User Info */}
      <div className="flex-1 lg:w-[300px] flex flex-col gap-4 lg:gap-[20px] bg-white">
        <div className="flex flex-row items-center gap-2 lg:gap-[10px] justify-center lg:justify-start">
          <p className="text-lg sm:text-xl font-medium">{user.firstName}</p>
          <p className="text-lg sm:text-xl font-medium">{user.lastName}</p>
        </div>
        <div className="flex flex-col gap-3 lg:gap-[10px]">
          <div className="flex flex-row items-center gap-2 justify-center lg:justify-start">
            <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"/>
            <p className="text-sm sm:text-base break-all">{user.email}</p>
          </div>
          <div className="flex flex-row items-center gap-2 justify-center lg:justify-start">
            <AtSymbolIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"/>
            <p className="text-sm sm:text-base">{user.username}</p>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center lg:justify-start">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"/>
            <p className="text-sm sm:text-base">{new Date(user.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
          </div>
        </div>
      </div>

      {/* Menu Toggle */}
      <div className="flex justify-center lg:justify-start">
        { isOpen 
          ? <BarsArrowDownIcon className="w-8 h-8 border border-slate-400 p-[5px] rounded-[50%] hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setIsOpen(false)}/>
          : <BarsArrowUpIcon className="w-8 h-8 border border-slate-400 p-[5px] rounded-[50%] hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setIsOpen(true)}/>
        }
      </div>

      {/* Dropdown Menu */}
      { isOpen && 
        <div className="absolute top-full right-4 sm:right-2 static top-auto right-auto 
          flex flex-col items-start transform translate-x 
          border border-slate-300 overflow-hidden h-auto lg:h-full
          bg-white shadow-lg lg:shadow-none rounded lg:rounded-none
          w-56 lg:w-auto z-10">
          <button className="flex flex-row items-center justify-between gap-[5px] hover:bg-gray-300 
            px-[12px] py-[5px] cursor-pointer border-b border-slate-300 w-full"
            onClick={handleLogout}>
            <p>Logout</p> 
            <ArrowRightOnRectangleIcon className="w-5 h-5"/>
          </button>
          <button className="flex flex-row items-center justify-between gap-[5px] hover:bg-gray-300
            px-[12px] py-[5px] cursor-pointer border-b border-slate-300 w-full"
            onClick={() => setEditing(true)}>
            <p>Edit</p>
            <PencilIcon className="w-5 h-5"/>
          </button>
          <Link to="/signup" className="flex flex-row items-center justify-between gap-[5px] hover:bg-gray-300
            px-[12px] py-[5px] cursor-pointer border-b border-slate-300 w-full">
            <p>Create new account</p>
            <PlusIcon className="w-5 h-5"/>
          </Link>
          <Link to="/myposts" className="flex flex-row items-center justify-between gap-[5px] hover:bg-gray-300
            px-[12px] py-[5px] cursor-pointer w-full">
            <p>Posts</p>
            <DocumentDuplicateIcon className="w-5 h-5"/>
          </Link>
        </div> 
      }
    </div>
        
    {/* Edit Modal */}
    {editing && 
      <div className="fixed inset-0 bg-opacity-50 backdrop-brightness-50 
        flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-md sm:max-w-lg lg:w-[600px] h-auto max-h-[90vh] p-4 rounded-lg overflow-y-auto">
          <div className="flex flex-row justify-between items-center mb-4"> 
            <p className="text-lg font-semibold">Edit</p>
            <XMarkIcon className="w-6 h-6 cursor-pointer 
              hover:rounded-[50%] hover:p hover:bg-gray-200" 
              onClick={() => setEditing(false)}/>
          </div>
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              className="outline-none border border-slate-300 p-3 rounded" 
              placeholder="Firstname"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
            <input 
              type="text" 
              className="outline-none border border-slate-300 p-3 rounded" 
              placeholder="Lastname"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
            <button type="submit" className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded transition-colors"
              onClick={() => { handleForm(); }}>Save</button>
          </div>
        </div>
      </div>
    }

    {/* Navigation Tabs */}
    <div className="mx-0 sm:mx-4 lg:mx-[60px] px-2 sm:px-4 lg:px-8 py-2 
      flex flex-row justify-between items-center border-b border-slate-400
      overflow-x-auto">
      <p className={`${activeTab === 'liked' ? 'bg-gray-300' : 'hover:bg-gray-300'} py-2 px-2 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-base`}
        onClick={() => {handleLiked();setActiveTab('liked')}}>
        Liked
      </p>
      <p className={`${activeTab === 'saved' ? 'bg-gray-300' : 'hover:bg-gray-300'} py-2 px-2 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-base`}
        onClick={() => {handleSaved();setActiveTab('saved')}}>
        Saved
      </p>
      <p className={`${activeTab === 'shared' ? 'bg-gray-300' : 'hover:bg-gray-300'} py-2 px-2 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-base`}
        onClick={() => {handleShared();setActiveTab('shared');}}>
        Shared
      </p>
      <p className={`${activeTab === 'commented' ? 'bg-gray-300' : 'hover:bg-gray-300'} py-2 px-2 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-base`}
        onClick={() => {setActiveTab('commented');handleCommented()}}>
        Commented
      </p>
      <p className={`${activeTab === 'read' ? 'bg-gray-300' : 'hover:bg-gray-300'} py-2 px-2 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-base`}
        onClick={() => {setActiveTab('read');handleRead();}}>
        Read
      </p>
    </div>

    {/* Posts Section */}
    <div className="mx-0 sm:mx-4 lg:mx-[60px] space-y-4 sm:space-y-6 lg:space-y-8 mt-4 sm:mt-6 lg:mt-[20px]
      mb-10 sm:mb-8 lg:mb-4">
      {posts.length > 0 ? 
        posts.map((post, index) => (
          <article key={index} 
            className="space-y-4 mx-0 sm:mx-4 lg:mx-[60px] border border-slate-300 py-4 sm:py-6 lg:py-[20px] px-4 sm:px-6 lg:px-[30px] rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <p className="font-semibold text-base sm:text-lg">{post.title}</p> 
              <Link to={`/view/${post.id}`} className="self-end sm:self-auto">
                <ArrowTopRightOnSquareIcon className="w-8 h-8 sm:w-9 sm:h-9 p-2 cursor-pointer hover:bg-gray-200 rounded-[50%]"/>
              </Link>
            </div>
            <p className="line-clamp-3 sm:line-clamp-4 text-sm sm:text-base text-gray-700">{post.content}</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <Link to={`/account/${post.author.username}`} className="text-blue-600 hover:underline text-sm sm:text-base">
                @{post.author?.username}
              </Link>
              <p className="text-gray-500 text-xs sm:text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </article>
        ))
	:<article className="flex flex-col justify-center items-center h-32 
	sm:h-48 md:h-[200px] lg:h-[250px] w-full bg-gray-100 rounded-lg border border-gray-200">
           <div className="text-center space-y-2 sm:space-y-3">
             <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
               bg-gray-300 rounded-full flex items-center justify-center">
               <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
               No articles found!
             </p>
           </div>
         </article> }
    </div>
  </div>
)
}

export default Profile
