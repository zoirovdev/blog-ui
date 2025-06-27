import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"



const Home = () => {
  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5) // You can make this adjustable
  
  const fetchPosts = async (page = 1, limit = postsPerPage) => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:8000/api/posts?page=${page}&limit=${limit}&published=true`
      )
      const data = await response.json()
      
      // Your API returns { posts, pagination, filters }
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchPosts(currentPage, postsPerPage)
  }, [currentPage, postsPerPage])

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
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 bg-white border-x border-slate-200 mt-[50px]">
        <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
        
        {/* Posts List */}
        <div className="space-y-6 mb-8">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts found.</p>
          ) : (
            posts.map(post => (
              <article key={post.id} className="border-b border-slate-400 pb-4">
                <div className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors space-y-4">
		  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800">
                      {post.title}
                    </h2>
		    <Link to={`/view/${post.id}`} 
		      className="ml-2 border border-slate-400 hover:bg-white hover:shadow-md rounded-[50%]
			p-[5px]">
		      <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
		    </Link>
		  </div>
                  <p className="text-gray-800 mb-2 line-clamp-3">
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
            Showing {posts.length} of {pagination.totalPosts} posts 
            (Page {pagination.currentPage || currentPage} of {pagination.totalPages})
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
