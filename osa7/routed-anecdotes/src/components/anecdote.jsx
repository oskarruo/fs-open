const Anecdote = ({ anecdote }) => (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      {anecdote.info
      ? <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
      : null
    }
    </div>
  )

export default Anecdote