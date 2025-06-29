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

      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
	headers: {
	  "Content-Type": 'application/json'
	},
 	body: JSON.stringify({
	  firstName: formData.firstName,
	  lastName: formData.lastName
	})
      })

      if(!response.ok){ 
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

      const response = await fetch(`http://localhost:8000/api/user/${user.id}/liked-posts`)
      if(!response.ok){
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

      const response = await fetch(`http://localhost:8000/api/user/${user.id}/saved-posts`)
      if(!response.ok){
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

      const response = await fetch(`http://localhost:8000/api/user/${user.id}/shared-posts`)
      if(!response.ok){
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

      const response = await fetch(`http://localhost:8000/api/user/${user.id}/commented-posts`)
      if(!response.ok){
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

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">Loading...</div>
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

   console.log(posts) 
  return (
    <div className="mt-[55px] ml-[60px] flex flex-col p-4">
      <div className="flex flex-row gap-8 p-[40px]">
	<div className="w-[150px] h-[150px] flex flex-col items-center 
	  justify-center border border-slate-300 rounded-[50%]">
	  <UserIcon className="w-20 h-20 text-blue-500"/>
	</div>
	<div className="w-[260px] flex flex-col gap-[20px] bg-white">
	  <div className="flex flex-row items-center gap-[10px]">
	    <p className="">{user.firstName}</p>
	    <p>{user.lastName}</p>
	  </div>
          <div className="flex flex-col gap-[10px]">
	    <div className="flex flex-row items-center gap-2">
	      <EnvelopeIcon className="w-5 h-5"/>
	      <p>{user.email}</p>
	    </div>
	    <div className="flex flex-row items-center gap-2">
	      <AtSymbolIcon className="w-5 h-5"/>
	      <p>{user.username}</p>
	    </div>
	    <div className="flex flex-row gap-2 items-center">
	      <CalendarIcon className="w-5 h-5"/>
	      <p className="">{new Date(user.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
	    </div>
	  </div>
	</div>
	<div className="">
	{ isOpen 
	  ? <BarsArrowDownIcon className="w-8 h-8 border border-slate-400 p-[5px] rounded-[50%] hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
	      onClick={() => setIsOpen(false)}/>
	  : <BarsArrowUpIcon className="w-8 h-8 border border-slate-400 p-[5px] rounded-[50%] hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
	      onClick={() => setIsOpen(true)}/>
	}
	</div>
	{ isOpen && 
	  <div className="flex flex-col items-start transform translate-x 
	    border border-slate-300 rounded-[10px] overflow-hidden h-full">
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
        <div>
          
	</div>
	{editing && 
	  <div className="fixed inset-0 bg-opacity-50 backdrop-brightness-50 
	    flex items-center justify-center z-50">
	    <div className="bg-white w-[600px] h-[250px] rounded-[5px] p-4">
	      <div className="flex flex-row justify-between"> 
	        <p>Edit</p>
                <XMarkIcon className="w-6 h-6 cursor-pointer 
		  hover:rounded-[50%] hover:p hover:bg-gray-200" 
		  onClick={() => setEditing(false)}/>
	      </div>
	      <div className="flex flex-col my-6 gap-4">
		<input 
	          type="text" 
		  className="outline-none border border-slate-300 rounded-[5px] p-2" 
		  placeholder="Firstname"
		  onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
		<input 
		  type="text" 
		  className="outline-none border border-slate-300 rounded-[5px] p-2" 
		  placeholder="Lastname"
		  onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
		<button type="submit" className="bg-blue-400 text-white p-2 rounded-[5px]"
		  onClick={() => { handleForm(); }}>Save</button>
	      </div>
	    </div>
	  </div>
	}
      </div>
      <div className="mx-[60px] px-8 py-2 
	flex flex-row justify-between items-center border-b border-slate-400">
	<p className="hover:bg-gray-300 rounded-[2px] py-2 px-4 cursor-pointer"
	  onClick={() => handleLiked()}>
	  Liked
	</p>
	<p className="hover:bg-gray-300 rounded-[2px] py-2 px-4 cursor-pointer"
	  onClick={() => handleSaved()}>
	  Saved
	</p>
        <p className="hover:bg-gray-300 rounded-[2px] py-2 px-4 cursor-pointer"
	  onClick={() => handleShared()}>
	  Shared
	</p>
	<p className="hover:bg-gray-300 rounded-[2px] py-2 px-4 cursor-pointer"
	  onClick={() => handleCommented()}>
	  Commented
	</p>
	<p className="hover:bg-gray-300 rounded-[2px] py-2 px-4 cursor-pointer"
	  onClick={() => handleRead()}>
	  Read
	</p>
      </div>
      <div className="mx-[60px] space-y-8 mt-[20px]">
        {posts.length > 0 && 
	  posts.map((post, index) => (
            <article key={index} 
	      className="space-y-4 mx-[60px] border border-slate-300 py-[20px] px-[30px] rounded-[5px]">
	      <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">{post.title}</p> 
		<Link to={`/view/${post.id}`} className="">
		  <ArrowTopRightOnSquareIcon className="w-9 h-9 p-2 cursor-pointer hover:bg-gray-200 rounded-[50%]"/>
		</Link>
	      </div>
	      <p className="line-clamp-4">{post.content}</p>
	      <div className="flex flex-row justify-between">
		<p>@{post.author?.username}</p>
		<p>{new Date(post.createdAt).toLocaleDateString()}</p>
	      </div>
	    </article>
	  ))
	}
      </div>
    </div>
  )
}

export default Profile
