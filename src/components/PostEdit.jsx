import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PostEdit = () => {
  const { id } = useParams()
  const [post, setPost] = useState({
    title: '',
    content: '',
    published: true,
    authorId: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const getPost = async () => {
    try { 
      setLoading(true)
      // Get token from localStorage (adjust based on where you store it)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      
      if(!response.ok) {
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
    try {
      // Get token from localStorage (adjust based on where you store it)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      // Remove id from the data being sent (it's already in the URL)
      const postData = {
        title: post.title,
        content: post.content,
        published: post.published,
      }

      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        alert('Post updated successfully!')
      } else {
        alert('Failed to update post')
      }
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
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        alert('Post deleted successfully!')
        // Redirect to home page or posts list
        window.location.href = '/'
      } else {
        const data = await response.json()
        alert(`Failed to delete post: ${data.error || 'Unknown error'}`)
      }
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-[800px] flex flex-col gap-4 my-[50px] p-6 rounded-[10px] bg-white border border-slate-200">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="font-bold w-full outline-none border-b-2 border-gray-200 focus:border-blue-500 pb-2 text-xl" 
            type="text" 
            name="title"
            placeholder="Post title..."
            value={post.title}
            onChange={handleInputChange}
          />
          
          <textarea 
            className="w-full outline-none border border-gray-200 rounded p-3 focus:border-blue-500 resize-none" 
            name="content"
            cols="50" 
            rows="15"
            placeholder="Write your post content..."
            value={post.content}
            onChange={handleInputChange}
          />
          
          <div className="flex items-center gap-2">
            <input 
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
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Update Post
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Delete Post
            </button>
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 

export default PostEdit
