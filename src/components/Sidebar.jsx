import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, Square2StackIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'react-tooltip'




const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-[50px] h-full w-[70px] bg-white flex flex-col 
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
  )
}


export default Sidebar
