import type { CSSProperties, HTMLAttributes, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'vue'

export type TElement = {
  id: number
  type: string
  text: string
  content: TElement[]
  styles: CSSProperties
  properties: HTMLAttributes | AnchorHTMLAttributes | ButtonHTMLAttributes
  meta: {
    hasChildren: boolean
  }
}
