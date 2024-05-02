import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
      setvoteAnecdote(state, action) {
        const id = action.payload.id
        const updatedAnecdotes = state.map(anecdote => anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
        return updatedAnecdotes.sort((a, b) => b.votes - a.votes)
      },
      appendAnecdote(state, action) {
        state.push(action.payload)
      },
      setAnecdotes(state, action) {
        return action.payload.sort((a, b) => b.votes - a.votes)
      }
  }
})

export const { setvoteAnecdote, appendAnecdote, setAnecdotes } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(asObject(content))
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    const votedAnecdote = anecdotes.find((anecdote) => anecdote.id == id)
    const newAnecdote = await anecdotesService.vote({ ...votedAnecdote, votes: votedAnecdote.votes + 1 })
    dispatch(setvoteAnecdote(newAnecdote))
  }
}

export default anecdotesSlice.reducer