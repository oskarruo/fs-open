import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Logout from './components/Logout'
import blogService from './services/blogs'
import loginService from './services/login' 
import loginForm from './components/Login'
import blogForm from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      await blogService.create({ title: title, author: author, url: url })
      const msgtitle = title
      const msgauthor = author
      setTitle('')
      setAuthor('')
      setUrl('')
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      setMessage(`new blog ${msgtitle} by ${msgauthor} was added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('creating failed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  } 

  if (user === null) {
    return (
      <div>
        {message}
        <h2>Log in to application</h2>
          {loginForm({ handleLogin, setUsername, setPassword, username, password })}
      </div>
    )
  }

  return (
    <div>
      {message}
      <h2>blogs</h2>
      {user.name} logged <Logout handleLogout={handleLogout}/>
      <h2>create new</h2>
      {blogForm({handleCreate, setTitle, setAuthor, setUrl, title, author, url})}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App