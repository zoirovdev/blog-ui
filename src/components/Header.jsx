import { Link } from 'react-router-dom'
import { UserIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' 


const Header = () => {
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()

  const handleEnter = (e) => {
    if(event.key === 'Enter'){
      if(event.target.value === ''){
	return
      }
      searchQuery()
    }
  } 

  const searchQuery = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/search?q=${searchVal}`)
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
    <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white flex flex-row border-b-1 border-slate-300 p-4 gap-2 items-center">
      <LightBulbIcon className="w-6 h-6 text-blue-400"/>
      <h2 className="font-sans text-xl antialiased font-bold font-stretch-extra-condensed tracking-tight">Dengiz</h2>
      <Link to="/" className="ml-8 font-sans text-lg font-medium">
	Home
      </Link>
      <Link to="/myposts" className="font-sans text-lg font-medium">
	My posts
      </Link>
      <div className="flex flex-row ml-[128px] border border-slate-300 rounded-[10px] items-center hover:shadow-sm 
	focus-within:shadow-sm">
	<MagnifyingGlassIcon className="w-6 h-6 ml-4"/>
        <input className="py-2 px-4 outline-none w-[500px]" placeholder="Search"
	  onChange={(e) => setSearchVal(e.target.value)}
	  onKeyDown={handleEnter}
	  />
      </div>
      <Link to="/new" className="p-1 rounded-[10px] border border-slate-300 hover:shadow-sm">
        <PlusIcon className="w-8 h-8"/>
      </Link>
      <Link to="/profile" className="absolute right-[20px]">
	<UserIcon className="w-10 h-10 border border-slate-300 p-2 rounded-[10px] hover:shadow-sm"/>
      </Link>
    </div>
  )
}


export default Header
