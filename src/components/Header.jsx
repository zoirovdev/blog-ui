import { Link } from 'react-router-dom'
import { UserCircleIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon } from '@heroicons/react/24/solid'



const Header = () => {
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
        <input className="py-2 px-4 outline-none w-[500px]" placeholder="Search"/>
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
