import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital?.[0]
  const languages = Object.values(country.languages || {})

  useEffect(() => {
    if (!capital) return

    let active = true
    weatherService
      .getByCapital(capital)
      .then((data) => {
        if (active) {
          setWeather(data)
        }
      })
      .catch(() => {
        if (active) {
          setWeather(null)
        }
      })

    return () => {
      active = false
    }
  }, [capital])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {capital}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="160"
      />

      {capital && weather && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          {weather.weather?.[0] && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          )}
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetail
