import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'



const SearchResult = () => {
  const location = useLocation()
  const { data } = location.state || {} 

  if(!data){
    return <div>Posts Not found</div>
  }


  console.log(data.results)
  return (
    <div className="bg-gray-50 min-h-screen mt-[50px]">
      <div className="max-w-4xl mx-auto p-6 bg-white border-x border-slate-200 min-h-screen">
	<h1 className="text-3xl font-bold mb-6">Search results</h1>

        <div className="space-y-6 mb-8">
          {data.results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts found.</p>
          ) : (
            data.results.map(post => (
              <article key={post.id} className="border-b border-slate-400 pb-4">
                <div className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors space-y-4">
		  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800">
                      {post.title}
                    </h2>
		    <Link to={`/view/${post.id}`} 
		      className="border border-slate-400 p-[5px] rounded-[50%]
			hover:bg-white hover:shadow-md">
		      <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
		    </Link>
		  </div>
                  <p className="text-gray-800 mb-2 line-clamp-4">
                    {post.content}
                  </p>
                  <div className="text-sm text-gray-600 flex flex-row justify-between items-center">
		    <p>@{post.author?.username}</p> 
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


export default SearchResult
