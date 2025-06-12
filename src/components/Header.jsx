import { Link } from 'react-router-dom'
import { UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { LightBulbIcon } from '@heroicons/react/24/solid'


const Header = () => {
  return (
    <div className="flex flex-row border-b-1 border-slate-300 p-4 gap-2 relative items-center">
      <LightBulbIcon className="w-6 h-6 text-orange-400"/>
      <h2 className="font-sans text-xl antialiased font-bold font-stretch-extra-condensed tracking-tight">Bloggy</h2>
      <Link to="/" className="mx-8 font-sans text-lg font-medium">
	Home
      </Link>
      <div className="flex flex-row ml-[128px] border border-slate-300 rounded-[8px] items-center">
	<MagnifyingGlassIcon className="w-6 h-6 ml-4"/>
        <input className="py-2 px-4 outline-none w-[500px]" placeholder="Search"/>
      </div>
      <Link to="/" className="absolute right-[20px]">
	<UserCircleIcon className="w-8 h-8 text-green-500"/>
      </Link>
    </div>
  )
}


export default Header
