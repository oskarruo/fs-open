import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Person = (props) => {
  return(
  <div>
    {props.person.name} {props.person.number}
    <button onClick={() => props.handleDelete(props.person.id)}>delete</button>
  </div>
  )
}

const Filter = (props) => {
 return(
  <div> 
    filter shown with: <input value={props.filter} onChange={props.handleFilter}/>
  </div>
 )
}

const PersonForm = (props) => {
  return(
    <div>
        <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleName}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = (props) => {
  return(
    <div>
      {props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase())).map(person => <Person person={person} key={person.id} handleDelete={props.handleDelete}/>)}
    </div>
  )
}

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  return(
    <div className="notification">
    {message}
  </div>
  )
}

const Error = ({message}) => {
  if (message === null) {
    return null
  }
  return(
    <div className="errormessage">
    {message}
  </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) == true) {
        const existingPerson = persons.find(person => person.name === newName)
        const updatedPerson = { ...existingPerson, number: newNumber }

        personsService
        .updateNumber(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person =>
            person.id === existingPerson.id ? response.data : person
          ))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Updated ${existingPerson.name}`)
          setTimeout(() => {
          setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    }
    else {
      const newPerson = { 
        name : newName, 
        number : newNumber
      }
      personsService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const deletedPerson = persons.find(person => person.id === id)
    if (confirm(`Delete ${deletedPerson.name}?`) == true) {
    personsService
    .deletePerson(id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
    })
    setNotificationMessage(`Deleted ${deletedPerson.name}`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}/>
      <Error message={errorMessage}/>
      <div>
        <Filter filter={filter} handleFilter={handleFilter}/>
      </div>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleName={handleName} newNumber={newNumber} handleNumber={handleNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App