import { Link } from 'react-router-dom'
import { UserCircleIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
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
    <div className="flex flex-row border-b-1 border-slate-300 p-4 gap-4 relative items-center">
      <LightBulbIcon className="w-6 h-6 text-blue-400"/>
      <h2 className="font-sans text-xl antialiased font-bold font-stretch-extra-condensed tracking-tight">Bloggy</h2>
      <Link to="/" className="ml-8 font-sans text-lg font-medium">
	Home
      </Link>
      <Link to="/myposts" className="font-sans text-lg font-medium">
	My posts
      </Link>
      <div className="flex flex-row ml-[128px] border border-slate-300 rounded-[8px] items-center">
	<MagnifyingGlassIcon className="w-6 h-6 ml-4"/>
        <input className="py-2 px-4 outline-none w-[500px]" placeholder="Search"
	  onChange={(e) => setSearchVal(e.target.value)}
	  onKeyDown={handleEnter}
	  />
      </div>
      <Link to="/new" className="p-1 rounded-[8px] border border-slate-300">
        <PlusIcon className="w-8 h-8"/>
      </Link>
      <Link to="/profile" className="absolute right-[20px]">
	<UserCircleIcon className="w-8 h-8 text-blue-500"/>
      </Link>
    </div>
  )
}


export default Header
