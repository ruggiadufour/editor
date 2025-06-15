import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TElement } from '@/types'

export const useGeneralStore = defineStore('general', () => {
  const elementDragging = ref<TElement | null>(null)

  return { elementDragging }
})
