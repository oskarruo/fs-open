import { useState } from 'react'

const Blog = ({ id, blog, handleLike, handleDelete, user }) => {
  const [expanded, setExpanded] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleExpanded = () => {
    setExpanded(!expanded)
  }

  const addLike = (event) => {
    event.preventDefault()
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    handleLike(id.toString(), updatedBlog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    handleDelete(id)
  }

  if (expanded) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={handleExpanded}>hide</button>
        <p>{blog.url}</p>
        likes {blog.likes}
        <button onClick={addLike}>like</button>
        <p>{blog.user.name}</p>
        {user.username === blog.user.username && (
          <button onClick={handleRemove}>delete</button>
        )}
      </div>
    )}
  return (
    <div style={blogStyle} className='blog' data-testid='blog'>
      {blog.title} {blog.author}
      <button onClick={handleExpanded}>view</button>
    </div>
  )
}

export default Blog