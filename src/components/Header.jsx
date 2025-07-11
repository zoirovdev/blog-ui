import { Link } from 'react-router-dom'
import { UserIcon, MagnifyingGlassIcon, PlusIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' 
import { Tooltip } from 'react-tooltip'


const Header = () => {
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'



  const handleEnter = (e) => {
    if(e.key === 'Enter'){
      if(e.target.value === ''){
	return
      }
      searchQuery()
    }
  } 

  const searchQuery = async () => {
    try {
      const token = localStorage.getItem('token')
      if(!token){
	navigate('/login')
	return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/search?q=${searchVal}`, {
        method: 'GET',
	headers: {
          "Content-Type": "application/json",
	  "Authorization": `Bearer ${token}`
	}
      })
      
      if(!response.ok){
        if(response.status === 401){
	  localStorage.removeItem('token')
	  localStorage.removeItem('user')
	  navigate('/login')
	  return
	}

        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      navigate('/search', {
        state: {
          data: data
	}
      })

    } catch (error) {
      console.error('Failed to search query', error)
    }
  }

return (
  <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white flex flex-row border-b border-slate-300 p-2 gap-2 items-center">
    <img src="/anchor.svg" alt="anchor" className="h-5 w-5 object-cover ml-2 sm:ml-[10px]"/>
    <h2 className="font-sans text-lg sm:text-xl antialiased font-bold font-stretch-extra-condensed tracking-tight">
      <span className="hidden sm:inline">Dengiz</span>
      <span className="sm:hidden">D</span>
    </h2>
    
    {/* Search - responsive width and positioning */}
    <div className="flex flex-row flex-1 sm:flex-none sm:ml-[220px] mx-2 sm:mx-0 border border-slate-300 h-10 items-center hover:shadow-sm focus-within:shadow-sm">
      <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-4"/>
      <input 
        className="py-2 px-2 sm:px-4 outline-none w-full sm:w-[500px] md:w-[400px] lg:w-[500px] text-sm sm:text-base" 
        placeholder="Search"
        onChange={(e) => setSearchVal(e.target.value)}
        onKeyDown={handleEnter}
      />
    </div>
    
    {/* Profile - always visible */}
    <Link 
      to="/profile" 
      className="sm:absolute sm:right-[20px]" 
      data-tooltip-id="profile" 
      data-tooltip-content="Profile"
    >
      <UserIcon className={`w-8 h-8 sm:w-10 sm:h-10 border border-slate-300 p-1 sm:p-2 rounded-[50%] hover:shadow-sm
        ${location.pathname === '/profile' ? 'bg-gray-300 border-none' : ''}`}/>
    </Link>
    <Tooltip id="profile"/>
  </div>
)
}

export default Header
