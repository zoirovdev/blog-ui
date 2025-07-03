import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

const PostEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState({
    title: '',
    content: '',
    published: true,
    authorId: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const getPost = async () => {
    try { 
      setLoading(true)
      // Get token from localStorage (adjust based on where you store it)
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
      
      if(!response.ok) {
	if(response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }
        if(response.status === 404){
          setError('Post not found')
        } else {
          throw new Error(data.error);
        }
        return
      }

      setPost(data)
    } catch (error) {
      console.log(error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPost(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!post.title.trim() || !post.content.trim()){
      alert('Title and content are required')
      return
    }

    try {
      // Get token from localStorage (adjust based on where you store it)
      const token = localStorage.getItem('token')
      
      // Remove id from the data being sent (it's already in the URL)
      const postData = {
        title: post.title,
        content: post.content,
        published: post.published,
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      })
      
      if(!response.ok) {
	if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

	alert('Failed to update post')
	return
      } 

      alert('Post updated successfully!')
    } catch (error) {
      console.log(error)
      alert('Error updating post')
    }
  }

  const handleDelete = async () => {
    // Confirm deletion
    const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.')
    
    if (!confirmDelete) return
    
    try {
      const token = localStorage.getItem('token') 
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
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

        const data = await response.json()
        alert(`Failed to delete post: ${data.error || 'Unknown error'}`)
	return
      }

      alert('Post deleted successfully!')
      // Redirect to home page or posts list
      navigate('/')
    } catch (error) {
      console.log(error)
      alert('Error deleting post')
    }
  }

  useEffect(() => {
    getPost()
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-[50px]">
      <div className="max-w-4xl mx-auto">
	<div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <PencilSquareIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Update Post</h1>
              </div>
            </div>
          </div>
        </div>

	<div className="bg-white border border-slate-300">
          <form onSubmit={handleSubmit} className="p-6">
	    <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={post.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400`}
                  placeholder="Enter your post title..."
                />
	   </div>
           <div className="mb-6">
             <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
               Content
             </label>           
             <textarea 
               className="w-full outline-none border border-gray-200 p-3 focus:border-blue-500 resize-none" 
               name="content"
               cols="50" 
               rows="15"
               placeholder="Write your post content..."
               value={post.content}
               onChange={handleInputChange}
             />
	   </div>  
          
            <div className="flex items-center gap-2">
              <input className="cursor-pointer"
                type="checkbox" 
                id="published"
                name="published"
                checked={post.published}
                onChange={(e) => setPost(prev => ({ ...prev, published: e.target.checked }))}
              />
              <label htmlFor="published">Published</label>
            </div>
          
            <div className="flex gap-4 mt-4">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 cursor-pointer"
              >
                Update
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-6 py-2 hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
	</div>
      </div>
    </div>
  )
} 

export default PostEdit
