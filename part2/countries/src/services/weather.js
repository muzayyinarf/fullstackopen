import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getByCapital = (capital) => {
  const apiKey = import.meta.env.VITE_SOME_KEY
  if (!apiKey || !capital) {
    return Promise.resolve(null)
  }

  const request = axios.get(baseUrl, {
    params: {
      q: capital,
      units: 'metric',
      appid: apiKey,
    },
  })
  return request.then((response) => response.data)
}

export default { getByCapital }
