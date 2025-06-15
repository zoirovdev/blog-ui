import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UserIcon } from '@heroicons/react/24/outline'


const View = () => {
  const { id } = useParams()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState({})
	
  const getPost = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: {
	  'Authorization': `Bearer ${token}`,
	  'Content-Type': 'application/json'
	}
      })

      const data = await response.json()

      if(!response.ok){
	if(response.status === 404){
	  setError('Post not found')
	} else {
	  throw new Error(data.error)
	}
	return
      }

      setPost(data)
    } catch (error) {
	console.log(error)
	setError(error)
    } finally {
	setLoading(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [id])

  if(loading) return <div className="p-4">Loading...</div>
  if(error) return <div className="p-4 text-red-500">{error}</div>

  console.log(post)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white w-[800px] min-h-screen p-8">
	<div className="flex flex-row items-center relative mb-6">
          <UserIcon className="w-10 h-10 border-2 border-violet-500 text-blue-500 rounded-[50%] p-2"/>
	  <p className="ml-4">{post.author.username}</p>
	  <time className="absolute right-4 text-sm border-t-2 border-t-cyan-300 p-2">
	    {new Date(post.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
	  </time>
	</div>
	<p className="mb-4 p-2 text-lg font-bold text-center border-l-2 border-l-orange-300">{post.title}</p>
	<p className="text-justify p-6 border-l-2 border-l-green-300">{post.content}</p>
      </div>
    </div>
  )
}


export default View
