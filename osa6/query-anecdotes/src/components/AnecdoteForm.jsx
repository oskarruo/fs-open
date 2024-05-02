const AnecdoteForm = ({handleCreate}) => {
  const onCreate = (event) => {
    event.preventDefault()
    handleCreate(event)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm