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
      const response = await fetch(`${API_BASE_URL}/api/posts/search?q=${searchVal}`)
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
    <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white flex flex-row border-b-1 border-slate-300 p-2 gap-2 items-center">
      <LightBulbIcon className="w-6 h-6 ml-2 text-blue-400"/>
      <h2 className="font-sans text-xl antialiased font-bold font-stretch-extra-condensed tracking-tight">Dengiz</h2>
      <div className="flex flex-row ml-[228px] border border-slate-300 h-10 items-center hover:shadow-sm 
	focus-within:shadow-sm">
	<MagnifyingGlassIcon className="w-6 h-6 ml-4"/>
        <input className="py-2 px-4 outline-none w-[500px]" placeholder="Search"
	  onChange={(e) => setSearchVal(e.target.value)}
	  onKeyDown={handleEnter}
	  />
      </div>
      <Link to="/profile" className="absolute right-[20px]" 
	data-tooltip-id="profile" data-tooltip-content="Profile">
	<UserIcon className={`w-10 h-10 border border-slate-300 p-2 rounded-[50%] hover:shadow-sm
	  ${location.pathname === '/profile' ? 'bg-gray-300 border-none' : ''}`}/>
      </Link>


      <Tooltip id="profile"/>
    </div>
  )
}


export default Header
