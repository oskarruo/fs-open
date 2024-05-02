import { useState } from 'react'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import AnecdoteList from './components/anecdotelist'
import About from './components/about'
import Footer from './components/footer'
import CreateNew from './components/createnew'
import Anecdote from './components/anecdote'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
    <Link style={padding} to="/">anecdotes</Link>
    <Link style={padding} to="/create">create new</Link>
    <Link style={padding} to="/about">about</Link>
  </div>
  )
}

const App = () => {
  const navigate = useNavigate()

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  const [notification, setNotification] = useState(null)

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote ${anecdote.content} was created!`)
    navigate('/')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification}
      <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
