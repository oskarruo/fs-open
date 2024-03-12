import axios from 'axios'
const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherUrl = 'https://api.weatherapi.com/v1/current.json'
const api_key = import.meta.env.VITE_WEATHER_KEY

const getAll = () => {
    return axios.get(allUrl)
}

const getWeather = (city) => {
    return axios.get(weatherUrl, {
        params: {
            key: api_key,
            q: city
        }
    })
}

export default {getAll, getWeather}
