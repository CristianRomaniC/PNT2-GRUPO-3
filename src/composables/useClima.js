// Composable que centraliza toda la lógica de clima (Open-Meteo).
// Antes esto estaba duplicado en WeatherGrid.vue y ClienteDashboard.vue.

const LAT = -34.6186
const LON = -58.4418

// Códigos de la WMO (World Meteorological Organization) que indican lluvia:
// 51,53,55 = llovizna | 61,63,65 = lluvia | 66,67 = lluvia helada | 80,81,82 = chubascos
const CODIGOS_LLUVIA = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82]

export function esCodigoLluvia(codigo) {
  return CODIGOS_LLUVIA.includes(codigo)
}

export function obtenerIconoClima(codigo) {
  if (codigo === 0) return '☀️'
  if ([1, 2, 3].includes(codigo)) return '☁️'
  if (esCodigoLluvia(codigo)) return '🌧️'
  return '⛅'
}

// Trae el pronóstico de Open-Meteo para Caballito (CABA).
// Usar { dias: 7 } para un rango de varios días, o { fechaDesde, fechaHasta }
// para un día puntual (formato YYYY-MM-DD).
export async function obtenerPronostico({ dias, fechaDesde, fechaHasta } = {}) {
  const params = new URLSearchParams({
    latitude: LAT,
    longitude: LON,
    daily: 'weather_code,temperature_2m_max',
    timezone: 'America/Argentina/Buenos_Aires',
  })

  if (dias) params.set('forecast_days', dias)
  if (fechaDesde) params.set('start_date', fechaDesde)
  if (fechaHasta) params.set('end_date', fechaHasta)

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

  const respuesta = await fetch(url)
  return respuesta.json()
}