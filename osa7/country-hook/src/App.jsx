import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
      if (!name) return

      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
          .then(response => {
              setCountry({ data: response.data, found: true })
          }).catch(error => {
            setCountry({ data: null, found: false })
          })
      }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  const common = country.data.name.common
  const official = country.data.name.official
  const languages = Object.keys(country.data.name.nativeName)
  const nativeName = country.data.name.nativeName[languages[0]].official
  const capital = country.data.capital[0]
  const population = country.data.population
  const flagUrl = country.data.flags.png

  return (
    <div>
      <h3>{common}</h3>
      <div>Official: {official}</div>
      <div>Native Name: {nativeName}</div>
      <div>Capital: {capital}</div>
      <div>Population: {population}</div>
      <img src={flagUrl} alt={`Flag of ${common}`} />
      {/* Render other properties as needed */}
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App