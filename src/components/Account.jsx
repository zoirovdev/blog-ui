import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
UserIcon, 
EnvelopeIcon, 
AtSymbolIcon, 
CalendarIcon,  
ArrowLeftIcon,
ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'



const Account = () => {
  const { username } = useParams()
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  
  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${username}`)
      if(!response.ok){
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setUser(data)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }

  const getPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/accounts/${username}/posts`)
      if(!response.ok){
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load')
    }
  }

  useEffect(() => {
    getUser()
    getPosts()
  }, [username])

  
  console.log(posts)
  return (
    <div className="mt-[47px] ml-[60px] flex flex-col p-4">
      <button className="flex flex-row justify-start items-center w-[90px] gap-2 cursor-pointer 
	bg-gray-200 p-2 hover:bg-gray-400 transition-colors`"
	onClick={() => navigate(-1)}>
	<ArrowLeftIcon className="w-5 h-5"/>
	<p>Back</p>
      </button>
      <div className="flex flex-row gap-8 p-[40px]">
	<div className="w-[150px] h-[150px] flex flex-col items-center 
	  justify-center border border-slate-300 rounded-[50%]">
	  <UserIcon className="w-20 h-20 text-blue-500"/>
	</div>
	<div className="w-[300px] flex flex-col gap-[20px] bg-white">
	  <div className="flex flex-row items-center gap-[10px]">
	    <p className="capitalize">{user.firstName}</p>
	    <p className="capitalize">{user.lastName}</p>
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
      </div>
      <div className="mx-[60px] px-8 py-2 
	flex flex-row justify-between items-center border-b border-slate-400">
	<p className="hover:bg-gray-300 py-2 px-4 cursor-pointer"
	  onClick={() => handlePosts()}>
	  Posts
	</p>
      </div>
      <div className="mx-[60px] space-y-8 mt-[20px]">
        {posts.length > 0 && 
	  posts.map((post, index) => (
            <article key={index} 
	      className="space-y-4 mx-[60px] border border-slate-300 py-[20px] px-[30px]">
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


export default Account
