import { useState } from 'react'
import useField from '../hooks'

const CreateNew = (props) => {
    const content = useField('content')
    const author = useField('author')
    const info = useField('info')
  
    const handleSubmit = (e) => {
      e.preventDefault()
      props.addNew({
        content: content.value,
        author: author.value,
        info: info.value,
        votes: 0
      })
    }

    const handleReset = (e) => {
        e.preventDefault()
        content.reset()
        author.reset()
        info.reset()
    }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input name='content' value={content.value} onChange={content.onChange} />
          </div>
          <div>
            author
            <input name='author' value={author.value} onChange={author.onChange} />
          </div>
          <div>
            url for more info
            <input name='info' value={info.value} onChange={info.onChange} />
          </div>
          <button>create</button>
          <button type="reset" onClick={handleReset}>reset</button>
        </form>
      </div>
    )
  }

export default CreateNew