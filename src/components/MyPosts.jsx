import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([])

  useEffect(() => {
    getMyPosts()
  }, [])

  const getMyPosts = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const userId = userData?.id

      const response = await fetch(`http://localhost:8000/api/users/${userId}/posts`)
      const data = await response.json()

      setMyPosts(data)
    } catch (error) {
      console.error('Something went wrong!', error)
    }
  }

  

   return (
     <div className="h-max bg-gray-50">
       <div className="max-w-4xl mx-auto p-6 bg-white border-x border-slate-200">
         <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      
         {/* Posts List */}
         <div className="space-t-6">
            {myPosts.map(post => (
              <article key={post.id} className="border-b border-slate-400 pb-4">
	        <Link to={`/edit-post/${post.id}`}>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-800 mb-2">{post.content}</p>
                <div className="text-sm text-gray-800">
                  By {post.author.firstName} {post.author.lastName} • 
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
   	        </Link>
              </article>
            ))}
         </div>

       </div>
     </div>
  )
}


export default MyPosts
