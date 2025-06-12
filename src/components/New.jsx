import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PencilSquareIcon, 
  EyeIcon, 
  DocumentIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const New = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          published: formData.published
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        } else if (response.status === 400) {
          setErrors({ general: data.error || 'Validation failed' })
        } else {
          throw new Error(data.error || 'Failed to create post')
        }
        return
      }

      // Post created successfully
      console.log('Post created successfully:', data)
      
      // Show success message and redirect
      alert(`Post "${data.title}" ${data.published ? 'published' : 'saved as draft'} successfully!`)
      navigate('/')
      
    } catch (error) {
      console.error('Create post error:', error)
      setErrors({ general: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, published: false }))
    // The form submission will handle the draft saving
    document.getElementById('post-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, published: true }))
    // The form submission will handle the publishing
    document.getElementById('post-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }

  const formatPreviewContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <PencilSquareIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreview(!preview)}
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                  preview 
                    ? 'border-blue-300 text-blue-700 bg-blue-50' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          {!preview ? (
            <form id="post-form" onSubmit={handleSubmit} className="p-6">
              {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {errors.general}
                </div>
              )}

              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your post title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Write your post content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Published Toggle */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="published"
                    name="published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publish immediately
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.published 
                    ? 'This post will be visible to everyone' 
                    : 'This post will be saved as a draft'
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      loading 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <DocumentIcon className="h-4 w-4 inline mr-1" />
                    Save Draft
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <CheckIcon className="h-4 w-4 inline mr-1" />
                    {loading 
                      ? 'Creating...' 
                      : formData.published ? 'Publish Post' : 'Save Draft'
                    }
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Preview Mode */
            <div className="p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {formData.title || 'Untitled Post'}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formData.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              
              <div className="prose max-w-none text-gray-900">
                {formData.content ? (
                  formatPreviewContent(formData.content)
                ) : (
                  <p className="text-gray-500 italic">No content yet...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default New
