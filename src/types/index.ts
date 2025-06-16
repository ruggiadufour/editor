import type {
  CSSProperties,
  HTMLAttributes,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ImgHTMLAttributes,
} from 'vue'

interface TElementBase {
  id: number
  text: string
  content: TElement[]
  type: string
  styles: CSSProperties
  meta: {
    props: Record<string, any>
    hasChildren: boolean
    isComponent?: boolean
  }
}

interface TElementLink extends TElementBase {
  type: 'link'
  properties: AnchorHTMLAttributes
}

interface TElementButton extends TElementBase {
  type: 'button'
  properties: ButtonHTMLAttributes
}

interface TElementImage extends TElementBase {
  type: 'image'
  properties: ImgHTMLAttributes
}

interface TElementGeneric extends TElementBase {
  type: 'paragraph' | 'container' | 'divider'
  properties: HTMLAttributes
}

interface TElementHeading extends TElementBase {
  type: 'heading'
  properties: HTMLAttributes
  meta: TElementBase['meta'] & {
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
}

type TElement = TElementLink | TElementButton | TElementGeneric | TElementImage | TElementHeading

export interface TElementComponent {
  id: number
  element: TElement
  props: Record<string, any>
}

export type { TElement }
