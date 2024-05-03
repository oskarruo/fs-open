import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Logout from "./components/Logout";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/Login";
import BlogForm from "./components/CreateBlog";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const BlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handleCreate = async (title, author, url) => {
    try {
      await blogService.create({ title: title, author: author, url: url });
      BlogFormRef.current.toggleVisibility();
      const msgtitle = title;
      const msgauthor = author;
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      setMessage(`new blog ${msgtitle} by ${msgauthor} was added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage("creating failed");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (id, blog) => {
    try {
      await blogService.update(id, blog);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      setMessage(`liked ${blog.title} by ${blog.author}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage("like failed");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      setMessage("delete completed");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage("deleting failed");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        {message}
        <h2>Log in to application</h2>
        {LoginForm({
          handleLogin,
          setUsername,
          setPassword,
          username,
          password,
        })}
      </div>
    );
  }

  return (
    <div className="container">
      {message}
      <h2>blogs</h2>
      {user.name} logged <Logout handleLogout={handleLogout} />
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <h2>create new</h2>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      <h2>list of blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            id={blog.id}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
