<template>
  <div class="d-flex flex-column gap-2">
    <div
      v-for="banda in bandasConDisponibilidad"
      :key="banda.key"
      :style="estilosBanda(banda)"
    >
      <!-- Header de la banda -->
      <div
        @click="toggleBanda(banda.key)"
        class="d-flex align-items-center justify-content-between px-3 py-2"
        :style="estilosHeader(banda)"
      >
        <div class="d-flex align-items-center gap-2">
          <span style="font-size: 1.1rem; line-height: 1;">{{ banda.icono }}</span>
          <div>
            <div :style="estilosNombreBanda(banda)">{{ banda.nombre }}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">{{ banda.rango }}</div>
          </div>
        </div>
        <span :style="estilosChevron(banda)">▼</span>
      </div>

      <!-- Slots expandidos -->
      <div
        v-if="abierta(banda.key)"
        style="border-top: 1px solid var(--color-border); padding: 10px 12px 12px;"
      >
        <!-- Sin horarios disponibles -->
        <p
          v-if="banda.slots.length === 0"
          class="mb-0"
          style="font-size: 0.8rem; color: var(--color-text-muted); font-style: italic;"
        >
          No hay horarios disponibles en esta franja
        </p>

        <!-- Pills de horarios -->
        <div v-else class="d-flex flex-wrap gap-2">
          <button
            v-for="slot in banda.slots"
            :key="slot"
            @click="seleccionar(slot)"
            class="btn"
            :style="estilosSlot(slot)"
          >
            {{ slot }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  horariosDisponibles: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const BANDAS = [
  { key: 'manana',   nombre: 'Mañana',   icono: '🌅', rango: '08:00 – 11:00 hs', desde: '08:00', hasta: '11:00' },
  { key: 'mediodia', nombre: 'Mediodía', icono: '☀️',  rango: '11:00 – 14:00 hs', desde: '11:00', hasta: '14:00' },
  { key: 'tarde',    nombre: 'Tarde',    icono: '🌇', rango: '14:00 – 17:00 hs', desde: '14:00', hasta: '17:00' },
]

// Qué bandas están abiertas (Set con los keys)
const bandasAbiertas = ref(new Set())

const toggleBanda = (key) => {
  const nuevo = new Set(bandasAbiertas.value)
  if (nuevo.has(key)) {
    nuevo.delete(key)
  } else {
    nuevo.add(key)
  }
  bandasAbiertas.value = nuevo
}

const abierta = (key) => bandasAbiertas.value.has(key)

// Filtra los horarios disponibles para cada banda
const bandasConDisponibilidad = computed(() =>
  BANDAS.map((banda) => ({
    ...banda,
    slots: props.horariosDisponibles.filter((h) => h >= banda.desde && h < banda.hasta),
  }))
)

const seleccionar = (slot) => {
  emit('update:modelValue', slot)
}

// Estilos dinámicos
const estilosBanda = (banda) => {
  const estaAbierta = abierta(banda.key)
  return {
    border: `1px solid ${estaAbierta ? 'var(--color-accent)' : 'var(--color-border)'}`,
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-alt)',
    cursor: 'pointer',
    transition: 'border-color .2s',
  }
}

const estilosHeader = (banda) => {
  const estaAbierta = abierta(banda.key)
  return {
    backgroundColor: estaAbierta ? 'rgba(93,202,165,0.07)' : 'transparent',
    cursor: 'pointer',
    userSelect: 'none',
  }
}

const estilosNombreBanda = (banda) => ({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: abierta(banda.key) ? 'var(--color-accent)' : 'var(--color-text)',
  transition: 'color .2s',
})

const estilosChevron = (banda) => ({
  fontSize: '0.7rem',
  color: 'var(--color-text-muted)',
  transform: abierta(banda.key) ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform .2s',
  display: 'inline-block',
})

const estilosSlot = (slot) => {
  const seleccionado = props.modelValue === slot
  return seleccionado
    ? 'background-color: var(--color-accent); color: var(--color-accent-text); border: none; border-radius: 20px; font-size: 0.8rem; font-weight: 500; padding: 4px 14px;'
    : 'background-color: var(--color-surface-strong); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 20px; font-size: 0.8rem; font-weight: 500; padding: 4px 14px;'
}
</script>