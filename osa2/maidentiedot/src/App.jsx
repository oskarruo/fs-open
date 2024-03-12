import {useState, useEffect} from 'react'
import countryService from './services/countries'

const Filter = (props) => {
  return (
  <div>
    find countries <input value={props.filter} onChange={props.handleFilter}/>
  </div>
  )
}

const CountryList = (props) => {
  const filtered = props.countries.filter(country => country.name.common.toLowerCase().includes(props.filter.toLowerCase()))
  if (filtered.length === 1) {
    return (
      <div>
        <Country country={filtered[0]}/>
      </div>
    )
  }
  if (filtered.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  return (
    filtered.map(country => <SimpleCountry country={country} key={country.name.common} handleShow={props.handleShow}/>)
  )
}

const SimpleCountry = (props) => {
  return (
    <div>
      <p>{props.country.name.common} <ShowButton handleShow={() => props.handleShow(props.country.name.common)} /> </p>
    </div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>

      <b>Languages:</b>
      <ul >
      {Object.entries(country.languages).map(([code, language]) => <li key={code}>{language}</li>)}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>

      <Weather country={country}/>
    </div>
  )
}

const ShowButton = (props) => {
  return (
    <button onClick={props.handleShow}>show</button>
  )
}

const Weather = (props) => {
  const [weather, setWeather] = useState(null)
  const capital = props.country.capital[0]
  
  useEffect(() => {
    countryService
      .getWeather(capital)
      .then(response => {
        setWeather(response.data)
  })
}, [capital])
  return (
    <div>
    <b>Weather in {capital}</b>
    {weather ? (
        <>
        <p>Temperature {weather.current.temp_c} Celsius</p>
        <p>{weather.current.condition.text}</p>
        <img src={weather.current.condition.icon} alt={`Symbol of ${weather.current.condition.text}`} />
        <p>Wind {(weather.current.wind_kph / 3.6).toFixed(1)} m/s</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  
  useEffect(() => {
    countryService.getAll().then((response) => {
      setCountries(response.data)
    })
  }, [])
  
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleShow = (country) => {
    setFilter(country)
  }

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <CountryList countries={countries} filter={filter} handleShow={handleShow}/>
    </div>
  )
}

export default App
