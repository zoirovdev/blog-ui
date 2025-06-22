import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
UserIcon, 
HeartIcon as HeartIconOutline, 
BookmarkIcon as BookmarkIconOutline,
PaperAirplaneIcon, 
ChatBubbleOvalLeftIcon,
Bars4Icon
} from '@heroicons/react/24/outline'

import {
HeartIcon as HeartIconSolid,
BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'


const View = () => {
  const { id } = useParams()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState({})
  const [like, setLike] = useState({})
  const [save, setSave] = useState({})

 
  // below comments are temporary it will be removed 
  // cause we don't need extra comments, comments automatically come with post
  const [comments, setComments] = useState([
  {
    id: 1,
    author: 'abbos',
    txt: 'Good article'
  },
  {
    id: 2,
    author: 'mahmud',
    txt: 'Very good content'
  }
  ])
	
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

  const getLike = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.log('No user found in localStorage')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.log('User ID not found')
	return
      }

      const response = await fetch(`http://localhost:8000/api/posts/${id}/like-status?userId=${user.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setLike(data)
    } catch (error) {
      console.log(error);
    }
  }

  const postLike = async () => {
    try {
      const userString = localStorage.getItem('user')
      if (!userString) {
        console.log('No user found in localStorage')
        return
      }
     
      const user = JSON.parse(userString)
      if (!user.id) {
        console.log('User ID not found')
        return
      }

      const response = await fetch(`http://localhost:8000/api/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          userId: user.id
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
          
      // Update local state after successful like
      setLike(data) // or however you want to update the like state
    
    } catch (error) {
      console.log('Error posting like:', error);
    }
  }

  const handleLike = () => {
    postLike()
  }

  const getSave = async () => {
    try {
      
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.log('No user found in localStorage')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.log('User ID not found')
	return
      }
      
      const response = await fetch(`http://localhost:8000/api/posts/${id}/save-status?userId=${user.id}`);
      if(!response.ok){
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSave(data)
    } catch (error) {
      console.error('Something went wrong', error);
    }
  }

  const postSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
	console.log('Token not found')
	return
      }

      const userStr = localStorage.getItem('user');
      if(!userStr){
	console.log('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.log('User id not found');
	return
      }

      const response = await fetch(`http://localhost:8000/api/posts/save`, {
        method: 'POST',
	headers: {
          "Content-Type": "application/json",
	  "Authorization": `Bearer ${token}`
	},
	body: JSON.stringify({
	  postId: id,
	  userId: user.id
	})
      })

      if(!response.ok){
	throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()

      setSave(data)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }

  const handleSave = () => {
    postSave()
  }

  useEffect(() => {
    getPost()
    getLike()
    getSave()
  }, [id])

  if(loading) return <div className="p-4">Loading...</div>
  if(error) return <div className="p-4 text-red-500">{error}</div>

  console.log(save)
  console.log(post)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-row mt-[50px]">
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


      <div className="m-5 flex flex-col gap-4">
        <div className="w-[360px] flex flex-row bg-white py-4 px-6 gap-6 rounded-[10px]">
	  <div className="flex flex-row gap-2">
	    {like.liked 
	      ? <HeartIconSolid className={`w-6 h-6 cursor-pointer text-red-600`}
	        onClick={() => { handleLike() }}/>
	      : <HeartIconOutline className='w-6 h-6 cursor-pointer'
	        onClick={() => { handleLike() }}/>
	    }
	    <p>{like.likeCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    {save.saved 
              ? <BookmarkIconSolid className="w-6 h-6 cursor-pointer text-green-600"
	         onClick={() => handleSave()}/>
	      : <BookmarkIconOutline className="w-6 h-6 cursor-pointer"
	         onClick={() => handleSave()}/>
	    }
	    <p>{save.saveCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <PaperAirplaneIcon className="w-6 h-6"/>
	    <p>7</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <ChatBubbleOvalLeftIcon className="w-6 h-6"/>
	    <p>20</p>
	  </div>
	  <div className="flex flex-row">
	    <Bars4Icon className="w-6 h-6"/>
          </div>
	</div>
	<div className="flex flex-col gap-2">
	  {comments.map((comment) => (
	    <div className="bg-white p-[10px]" key={comment.id}>
              <p className="text-sm">@{comment.author}</p>
              <p className="text-md">{comment.txt}</p>
	    </div>
	  ))}
	</div>
      </div>
    </div>
  )
}


export default View
