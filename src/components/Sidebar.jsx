import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, Square2StackIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'react-tooltip'




const Sidebar = () => {
  const location = useLocation()

return (
  <>
    {/* Desktop Sidebar */}
    <div className="hidden md:flex fixed left-0 top-[50px] h-full w-[70px] bg-white flex-col 
      border-r border-r-slate-300 pt-3 gap-1">
      <div className="border border-slate-300 mx-2">
        <Link to={"/"} 
          className={`py-3 px-1 flex flex-wrap justify-center hover:bg-gray-300 
          ${location.pathname === '/' ? 'bg-gray-300' : ''}`}
          data-tooltip-id="home" data-tooltip-content="Home">
          <HomeIcon className="w-6 h-6"/>
        </Link>
        <Link to={"/myposts"} 
          className={`py-3 px-1 flex flex-wrap justify-center hover:bg-gray-300
          ${location.pathname === '/myposts' ? 'bg-gray-300' : ''}`} 
          data-tooltip-id="my-posts" data-tooltip-content="My posts">
          <Square2StackIcon className="w-6 h-6"/>
        </Link>
        <Link to="/new" 
          className={`py-3 px-1 flex flex-wrap justify-center hover:bg-gray-300
          ${location.pathname === '/new' ? 'bg-gray-300' : ''}`} 
          data-tooltip-id="new-post" data-tooltip-content="Create new post">
          <PlusIcon className='w-6 h-6'/>
        </Link>
      </div>
      <Tooltip id="home"/>
      <Tooltip id="my-posts"/>
      <Tooltip id="new-post"/>
    </div>

    {/* Mobile Bottom Navigation */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-300 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <Link to={"/"} 
          className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100
          ${location.pathname === '/' ? 'bg-gray-200' : ''}`}>
          <HomeIcon className="w-6 h-6"/>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to={"/myposts"} 
          className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100
          ${location.pathname === '/myposts' ? 'bg-gray-200' : ''}`}>
          <Square2StackIcon className="w-6 h-6"/>
          <span className="text-xs mt-1">My Posts</span>
        </Link>
        <Link to="/new" 
          className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100
          ${location.pathname === '/new' ? 'bg-gray-200' : ''}`}>
          <PlusIcon className='w-6 h-6'/>
          <span className="text-xs mt-1">Create</span>
        </Link>
      </div>
    </div>
  </>
)
}


export default Sidebar
