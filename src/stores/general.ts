import { ref, computed, watch, onMounted, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { TElement, TTabs, TVariable, TVariableForm, TVariableGroup } from '@/types'
import { BaseElements } from '@/utils/constants'

const containerElement = BaseElements.find((element) => element.type === 'container')!

export const useGeneralStore = defineStore('general', () => {
  const elementDragging = ref<TElement | null>(null)
  const selectedElement = ref<TElement | null>(null)
  const selectedTab = ref<TTabs>('elements')
  const currentDocument = ref<TElement>(structuredClone(containerElement))
  const showGrid = ref(true)
  const elements = ref<TElement[]>(structuredClone(BaseElements))
  const blocks = ref(
    [1, 2, 3, 4, 5, 6].map((item) => {
      const element = structuredClone(containerElement)
      element.id = item
      element.text = `${item} columns`
      element.styles.display = 'grid'
      element.content = Array.from({ length: item }, () => structuredClone(containerElement))
      element.styles.gridTemplateColumns = `repeat(${item}, 1fr)`
      return element
    }),
  )
  const components = ref<TElement[]>([])
  const variables = ref<TVariable>({
    '--colors-secondary': '#ff0000',
    '--colors-tertiary': '#0000ff',
    '--spacing-xs': '10px',
    '--spacing-sm': '20px',
    '--spacing-md': '30px',
    '--spacing-lg': '40px',
    '--spacing-xl': '50px',
    '--radius-xs': '10px',
    '--radius-sm': '20px',
    '--radius-md': '30px',
    '--radius-lg': '40px',
    '--radius-xl': '50px',
    '--radius-full': '100%',
    '--breakpoints-xs': '480px',
    '--breakpoints-sm': '768px',
    '--breakpoints-md': '1024px',
    '--breakpoints-lg': '1280px',
    '--breakpoints-xl': '1536px',
  })
  const newVariable = ref<TVariableForm>({
    group: 'colors',
    name: '',
    value: '',
  })

  const groupedVariables = computed(() => {
    const groups: Record<
      string,
      { group: string; variables: { name: string; value: string; key: string }[] }
    > = {}

    Object.entries(variables.value).forEach(([key, value]) => {
      // Extraer el grupo y nombre de la variable (ej: '--colors-secondary' -> group: 'colors', name: 'secondary')
      const match = key.match(/^--([^-]+)-(.+)$/)
      if (match) {
        const [, group, name] = match
        groups[group] ??= {
          group,
          variables: [],
        }
        groups[group].variables.push({ name, value, key })
      }
    })

    // Convertir a array con el formato solicitado
    return groups
  })

  const currentTabElements = computed(() => {
    if (selectedTab.value === 'elements') return elements.value
    if (selectedTab.value === 'blocks') return blocks.value
    if (selectedTab.value === 'components') return components.value
    return []
  })

  const handleSelectElement = (block: TElement) => {
    selectedElement.value = block
    if (block.meta.isComponent) {
      selectedTab.value = 'components'
    } else if (block.type !== 'container') {
      selectedTab.value = 'elements'
    }
  }

  const handleCreateComponent = (block: TElement) => {
    block.meta.isComponent = true
    block.id = Date.now()
    block.meta.props = {}
    components.value.push(block)
    console.log(components.value)
  }

  const handleAddVariable = () => {
    variables.value[`--${newVariable.value.group}-${newVariable.value.name}`] =
      newVariable.value.value
    newVariable.value = {
      group: 'colors',
      name: '',
      value: '',
    }
  }

  const applyVariablesToDOM = () => {
    const root = document.documentElement
    Object.entries(variables.value).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }

  const saveState = () => {
    localStorage.setItem(
      'state',
      JSON.stringify({
        variables: toRaw(variables.value),
        document: toRaw(currentDocument.value),
      }),
    )
  }

  const handleDeleteVariable = (key: string) => {
    delete variables.value[key as keyof TVariable]
  }

  watch(
    variables,
    () => {
      applyVariablesToDOM()
    },
    { deep: true },
  )

  const getSavedState = () => {
    const state = localStorage.getItem('state')

    if (state) {
      const data = JSON.parse(state)

      variables.value = data.variables
      currentDocument.value = data.document
    }
  }

  onMounted(() => {
    applyVariablesToDOM()
    getSavedState()
  })

  return {
    currentDocument,
    elementDragging,
    selectedElement,
    selectedTab,
    showGrid,
    elements,
    blocks,
    components,
    variables,
    newVariable,
    groupedVariables,
    currentTabElements,

    handleSelectElement,
    handleCreateComponent,
    handleAddVariable,
    applyVariablesToDOM,
    saveState,
    handleDeleteVariable,
  }
})
