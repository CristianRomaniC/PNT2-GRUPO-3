export const VEHICULOS = [
  { key: 'moto',      label: 'Moto',      icono: '🏍️', duracion: 15 },
  { key: 'auto',      label: 'Auto',      icono: '🚗', duracion: 30 },
  { key: 'camioneta', label: 'Camioneta', icono: '🚙', duracion: 45 },
]

export const getVehiculo = (key) => VEHICULOS.find(v => v.key === key)