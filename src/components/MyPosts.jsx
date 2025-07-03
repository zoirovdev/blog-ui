import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon, PencilSquareIcon } from "@heroicons/react/24/outline"



const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5) 
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  // Single useEffect that handles page changes
  useEffect(() => {
    getMyPosts(currentPage, postsPerPage)
  }, [currentPage, postsPerPage])

  const getMyPosts = async (page = 1, limit = postsPerPage) => {
    try {
      setLoading(true)

      const userData = JSON.parse(localStorage.getItem('user'))
      const token = localStorage.getItem('token')
      const userId = userData?.id

      if (!userId || !token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/api/user/posts?page=${page}&limit=${limit}&authorId=${userId}`,
	{
          headers: 
	  {
            'Authorization': `Bearer ${token}`,  // Add auth header
            'Content-Type': 'application/json'
          }
	}
      )

      if (!response.ok) {
	if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle different possible response structures
      if (data.posts) {
        setMyPosts(data.posts)
        setPagination(data.pagination || {})
      } else if (Array.isArray(data)) {
        setMyPosts(data)
      } else {
        setMyPosts(data)
        setPagination(data.pagination || {})
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setMyPosts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white border-x border-slate-200 min-h-screen mt-[50px]">
        <h1 className="text-3xl font-bold mb-6">My Posts</h1>
        
        {/* Posts List */}
        <div className="space-y-6 mb-8">
          {myPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts found.</p>
          ) : (
            myPosts.map(post => (
              <article key={post.id} className="border-b border-slate-400 pb-4">
                <div className="block hover:bg-gray-50 p-2 -m-2 space-y-[13px] rounded transition-colors">
		  <div className="flex flex-row justify-between items-center">
		    <h2 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800">
                      {post.title}
                    </h2>
		    <div className="flex flex-row gap-[10px] ml-2 items-center">
		      <Link to={`/view/${post.id}`}
			className="border border-slate-400 rounded-[50%] p-[5px] hover:bg-white hover:shadow-md">
		        <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
		      </Link>
		      <Link to={`/edit-post/${post.id}`}
			className="border border-slate-400 rounded-[50%] p-[5px] hover:bg-white hover:shadow-md">
		        <PencilSquareIcon className="w-5 h-5"/>
		      </Link>
		    </div>
		  </div>
                  <p className="text-gray-800 mb-2 line-clamp-4">
                    {post.content}
                  </p>
                  <div className="text-sm text-gray-600">
                    <div className="flex flex-row justify-between items-center"> 
		      <p>@{post.author?.username}</p> 
                      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
		    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevPage}
              className={`px-4 py-2 rounded ${
                pagination.hasPrevPage 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === pagination.currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              className={`px-4 py-2 rounded ${
                pagination.hasNextPage 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination.totalPosts && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {myPosts.length} of {pagination.totalPosts} posts 
            (Page {pagination.currentPage || currentPage} of {pagination.totalPages})
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPosts
