import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
UserIcon, 
HeartIcon as HeartIconOutline, 
BookmarkIcon as BookmarkIconOutline,
PaperAirplaneIcon as AirplaneOutline, 
ChatBubbleOvalLeftIcon,
EyeIcon as EyeIconOutline,
XMarkIcon
} from '@heroicons/react/24/outline'

import {
HeartIcon as HeartIconSolid,
BookmarkIcon as BookmarkIconSolid,
EyeIcon as EyeIconSolid,
PaperAirplaneIcon as AirplaneSolid
} from '@heroicons/react/24/solid'


const View = () => {
  const { id } = useParams()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState({})
  const [like, setLike] = useState({})
  const [save, setSave] = useState({})
  const [share, setShare] = useState({})
  const [shareModal, setShareModal] = useState(false)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState({
    content: '',
    user: {},
    id: ''
  })
  const [commentModal, setCommentModal] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const [readNum, setReadNum] = useState(0)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  const getPost = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      if(!token){
	navigate('/login')
	return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        headers: {
	  'Authorization': `Bearer ${token}`,
	  'Content-Type': 'application/json'
	}
      })

      const data = await response.json()
	
      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
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

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') 
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/like-status?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })


      if (!response.ok) {
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
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

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') 
        return
      }


      const response = await fetch(`${API_BASE_URL}/api/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
	  'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: id,
          userId: user.id
        })
      })

      if (!response.ok) {
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

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

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/save-status?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
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
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
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

      const response = await fetch(`${API_BASE_URL}/api/posts/save`, {
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
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
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

  const getShare = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found.Unauthorized');
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id is not found')
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/share-status?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShare(data)
    } catch (error) {
      console.error('Failed to load', error.message)
    }
  }

  const postShare = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if(!userStr){
	console.error('User not found.Unauthorized', error)
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id is not found', error)
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/share`, {
        method: 'POST',
	headers: {
	  'Authorization': `Bearer ${token}`,
      	  "Content-Type": 'application/json'
	},
	body: JSON.stringify({
          postId: id,
	  userId: user.id
	})
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      setShare(data)
      return data
    } catch (error) {
      console.error('Failed to load', error);
    }
  }

  const handleShare = () => {
    setShareModal(true)
  }

  const copyToClipboard = async () => {
    await postShare()

    const url = window.location.href;
    await navigator.clipboard.writeText(url)

    setShareModal(false)
  }


  const getComments = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/comments?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setComments(data.comments)
      setCommentCount(data.commentCount)
    } catch (error) {
      console.error('Failed to load', error)
    }
  }


  const createComment = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('Failed to get user from localStorage')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id is not valid')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      comment.postId = parseInt(id)
      comment.userId = user.id
	
      const response = await fetch(`${API_BASE_URL}/api/posts/comment`, {
        method: 'POST',
	headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
	},
	body: JSON.stringify({
	  content: comment.content,
	  postId: comment.postId,
	  userId: comment.userId
	})
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setComment(data)
      await getComments()
    } catch (error) {
      console.error('Failed to load');
    }
  }


  const handleComment = () => {
    setCommentModal(true)
  }

  const handleTextarea = (val) => {
    setComment({...comment, content: val});
  }


  const getReadNum = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/read`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setReadNum(data.readCount)
    } catch (error) {
      console.error('Failed to load')
    }
  }


  const postRead = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if(!userStr){
	console.error('User not found')
	return
      }

      const user = JSON.parse(userStr)
      if(!user.id){
	console.error('User id not found')
	return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login') // Also need to import useNavigate
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/read`, {
        method: 'POST',
	headers: {
	  'Authorization': `Bearer ${token}`,
	  "Content-Type": 'application/json'
	},
	body: JSON.stringify({
          postId: id,
	  userId: user.id
	})
      })

      if(!response.ok){
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
	throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setReadNum(data.readCount)
      await getReadNum()
    } catch (error) {
      console.error('Something went wrong')
    }
  }


  useEffect(() => {
    getPost()
    postRead()
    getLike()
    getSave()
    getShare()
    getComments()
  }, [id])

  if(loading) return <div className="p-4">Loading...</div>
  if(error) return <div className="p-4 text-red-500">{error}</div>

  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col pl-[200px] pt-[100px] pb-[50px] gap-4">
      <div className="bg-white w-[880px] min-h-screen py-8 px-10">
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


      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between bg-white w-[880px] py-4 px-15 rounded-[10px]">
	  <div className="flex flex-row gap-2">
	    <p>Like</p>
	    {like.liked 
	      ? <HeartIconSolid className={`w-6 h-6 cursor-pointer text-red-600`}
	        onClick={() => { handleLike() }}/>
	      : <HeartIconOutline className='w-6 h-6 cursor-pointer'
	        onClick={() => { handleLike() }}/>
	    }
	    <p>{like.likeCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <p>Save</p>
	    {save.saved 
              ? <BookmarkIconSolid className="w-6 h-6 cursor-pointer text-green-600"
	         onClick={() => handleSave()}/>
	      : <BookmarkIconOutline className="w-6 h-6 cursor-pointer"
	         onClick={() => handleSave()}/>
	    }
	    <p>{save.saveCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <p>Share</p>
	    {share.shared 
	      ? <AirplaneSolid className="w-6 h-6 cursor-pointer text-blue-600"
	          onClick={() => handleShare()}/>
	      : <AirplaneOutline className="w-6 h-6 cursor-pointer" 
		  onClick={() => handleShare()}/>
	    }
	    <p>{share.shareCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <p>Comment</p>
	    <ChatBubbleOvalLeftIcon className="w-6 h-6 cursor-pointer" 
	      onClick={() => handleComment()}/>
	    <p>{commentCount}</p>
	  </div>
	  <div className="flex flex-row gap-2">
	    <p>Reads</p>
	    <EyeIconOutline className="w-6 h-6"/>
	    <p>{readNum}</p>
          </div>
	</div>
	<div className="flex flex-col gap-2">
	  {comments?.map((comment) => (
	    <div className="bg-white py-[10px] px-15 max-w-[880px]" key={comment.id}>
	      <div className="flex flex-row items-center relative">
                <p className="text-sm">@{comment.user.username}</p>
	        <p className="text-[13px] absolute right-2">
		  {new Date(comment.createdAt)
		    .toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
	          }
	        </p>
	      </div>
              <p className="text-md">{comment.content}</p>
	    </div>
	  ))}
	</div>
      </div>
      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
	        {share.shared ? 'Shared post' : 'Share post'}
	      </h3>
              <XMarkIcon 
                className="w-6 h-6 cursor-pointer hover:text-gray-600" 
                onClick={() => setShareModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                <span className="text-sm text-gray-600 flex-1 truncate">
                  {window.location.href}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

	{/* Comment modal */}
	{commentModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 w-[500px] max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
	        Write comment
	      </h3>
              <XMarkIcon 
                className="w-6 h-6 cursor-pointer hover:text-gray-600" 
                onClick={() => setCommentModal(false)}
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <textarea rows="5" cols="25" 
		className="outline-none p-4 border border-slate-400 rounded-[5px]"
		placeholder="Enter your message here..."
		value={comment.content}
		onChange={(e) => {
		  handleTextarea(e.target.value);
		}}>
	      </textarea>
              <button className="px-3 py-1 bg-blue-500 text-white 
		text-sm rounded hover:bg-blue-600 cursor-pointer"
		onClick={() => {
		  createComment()
		  setComment({ content: '' })
		  setCommentModal(false)
		}}>
                  Write
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


export default View
