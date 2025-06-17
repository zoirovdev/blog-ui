import { Link } from 'react-router-dom'
import { HomeIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'react-tooltip'

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-[50px] h-full w-[60px] bg-white flex flex-col 
	border-r border-r-slate-300 pt-3 gap-1">
      <Link to={"/"} className="border border-slate-300 rounded-[10px]
	py-3 px-1 mx-2 flex flex-wrap justify-center hover:shadow-sm"
	data-tooltip-id="home" data-tooltip-content="Home">
	<HomeIcon className="w-6 h-6"/>
      </Link>
      <Link to={"/myposts"} className="border border-slate-300 rounded-[10px] 
	py-3 px-1 mx-2 flex flex-wrap justify-center hover:shadow-sm" 
	data-tooltip-id="my-posts" data-tooltip-content="My posts">
        <Square2StackIcon className="w-6 h-6"/>
      </Link>

     <Tooltip id="home"/>
     <Tooltip id="my-posts"/>
    </div>
  )
}


export default Sidebar
