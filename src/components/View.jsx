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
    <div className="bg-gray-100 min-h-screen flex flex-col mt-[50px]">
      <div className="bg-white w-[880px] min-h-screen py-8 px-10 ml-[60px]">
	<p className="mb-4 p-4 text-xl font-bold text-left">{post.title}</p>
	<div className="flex flex-row items-center mb-2 text-gray-600">
	  <p className="ml-4 text-md">By @{post.author.username}</p>
	  <time className="text-md p-2">
	    | on {new Date(post.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
	  </time>
	</div>
	<div className="text-justify p-4 text-lg">
  	  {post.content.split('\n').map((line, index) => (
    	    <div key={index} className="mb-4">
              {line || '\u00A0'}
            </div>
          ))}
        </div>      
      </div>
    </div>
  )
}


export default View
