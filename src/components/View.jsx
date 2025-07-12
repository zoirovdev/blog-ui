import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
UserIcon,
ArrowLeftIcon,
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
  <div className="bg-gray-100 min-h-screen flex flex-col 
    px-4 sm:px-6 md:pl-8 lg:pl-[200px] 
    py-4 sm:py-6 md:pt-[60px] lg:pt-[100px] 
    pb-20 sm:pb-16 md:pb-[50px] lg:pb-[50px] 
    gap-4">
    
    {/* Back Button */}
    <button className="flex flex-row justify-start items-center 
      w-auto max-w-[120px] gap-2 cursor-pointer 
      bg-gray-200 p-2 sm:p-3 hover:bg-gray-400 transition-colors"
      onClick={() => navigate(-1)}>
      <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
      <p className="text-sm sm:text-base">Back</p>
    </button>

    {/* Main Content */}
    <div className="bg-white 
      w-full max-w-4xl 
      min-h-[60vh] 
      py-6 sm:py-8 
      px-4 sm:px-6 lg:px-10 
      shadow-sm">
      
      {/* Post Title */}
      <h1 className="mb-4 sm:mb-6 p-2 sm:p-4 
        text-lg sm:text-xl lg:text-2xl 
        font-bold text-left leading-tight">
        {post.title}
      </h1>
      
      {/* Author and Date */}
      <div className="flex flex-col sm:flex-row sm:items-center 
        mb-4 sm:mb-6 text-gray-600 gap-1 sm:gap-0">
        <p className="ml-2 sm:ml-4 text-sm sm:text-md">
          By @{post.author.username}
        </p>
        <time className="text-sm sm:text-md sm:p-2 ml-2 sm:ml-0">
          <span className="hidden sm:inline">| </span>
          <span className="sm:hidden">Published </span>
          on {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </time>
      </div>
      
      {/* Post Content */}
      <div className="text-justify p-2 sm:p-4 
        text-sm sm:text-base lg:text-lg 
        leading-relaxed">
        {post.content.split('\n').map((line, index) => (
          <div key={index} className="mb-3 sm:mb-4">
            {line || '\u00A0'}
          </div>
        ))}
      </div>      
    </div>

    {/* Engagement Section */}
    <div className="flex flex-col gap-4">
      
      {/* Action Buttons */}
      <div className="flex flex-row sm:flex-row sm:justify-between 
        bg-white w-full max-w-4xl 
        py-4 px-4 sm:px-6 lg:px-8 
        shadow-sm gap-4 sm:gap-2">
        
        {/* Like */}
        <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
          <p className="hidden text-sm sm:text-base">Like</p>
          {like.liked 
            ? <HeartIconSolid className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-red-600"
                onClick={() => { handleLike() }}/>
            : <HeartIconOutline className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                onClick={() => { handleLike() }}/>
          }
          <p className="text-sm sm:text-base font-medium">{like.likeCount}</p>
        </div>
        
        {/* Save */}
        <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
          <p className="hidden text-sm sm:text-base">Save</p>
          {save.saved 
            ? <BookmarkIconSolid className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-green-600"
                onClick={() => handleSave()}/>
            : <BookmarkIconOutline className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                onClick={() => handleSave()}/>
          }
          <p className="text-sm sm:text-base font-medium">{save.saveCount}</p>
        </div>
        
        {/* Share */}
        <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
          <p className="hidden text-sm sm:text-base">Share</p>
          {share.shared 
            ? <AirplaneSolid className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-blue-600"
                onClick={() => handleShare()}/>
            : <AirplaneOutline className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" 
                onClick={() => handleShare()}/>
          }
          <p className="text-sm sm:text-base font-medium">{share.shareCount}</p>
        </div>
        
        {/* Comment */}
        <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
          <p className="hidden text-sm sm:text-base">Comment</p>
          <ChatBubbleOvalLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" 
            onClick={() => handleComment()}/>
          <p className="text-sm sm:text-base font-medium">{commentCount}</p>
        </div>
        
        {/* Reads */}
        <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
          <p className="hidden text-sm sm:text-base">Reads</p>
          <EyeIconOutline className="w-5 h-5 sm:w-6 sm:h-6"/>
          <p className="text-sm sm:text-base font-medium">{readNum}</p>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {comments?.map((comment) => (
          <div className="bg-white 
            py-4 px-4 sm:px-6 lg:px-8 
            w-full max-w-4xl 
            rounded-lg shadow-sm" 
            key={comment.id}>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
              mb-2 sm:mb-3 gap-1 sm:gap-0">
              <p className="text-sm sm:text-base font-medium text-gray-700">
                @{comment.user.username}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(comment.createdAt)
                  .toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  })
                }
              </p>
            </div>
            
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Share Modal */}
    {shareModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm 
        flex items-center justify-center z-50 p-4">
        <div className="bg-white shadow-xl 
          w-full max-w-md mx-4 
          p-6">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {share.shared ? 'Shared post' : 'Share post'}
            </h3>
            <XMarkIcon 
              className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" 
              onClick={() => setShareModal(false)}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 
              border border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600 flex-1 truncate">
                {window.location.href}
              </span>
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white 
                  text-sm hover:bg-blue-600 
                  transition-colors cursor-pointer
                  whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Comment Modal */}
    {commentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm 
        flex items-center justify-center z-50 p-4">
        <div className="bg-white shadow-xl 
          w-full max-w-lg mx-4 
          p-6 max-h-[90vh] overflow-y-auto">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Write comment
            </h3>
            <XMarkIcon 
              className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" 
              onClick={() => setCommentModal(false)}
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <textarea 
              rows="6" 
              className="outline-none p-4 border border-gray-300
                resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                text-sm sm:text-base"
              placeholder="Share your thoughts..."
              value={comment.content}
              onChange={(e) => {
                handleTextarea(e.target.value);
              }}>
            </textarea>
            
            <button 
              className="w-full sm:w-auto sm:self-end
                px-6 py-3 bg-blue-500 text-white 
                text-sm sm:text-base 
                hover:bg-blue-600 transition-colors cursor-pointer
                font-medium"
              onClick={() => {
                createComment()
                setComment({ content: '' })
                setCommentModal(false)
              }}>
              Post Comment
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

export default View
