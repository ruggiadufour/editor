import type {
  CSSProperties,
  HTMLAttributes,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ImgHTMLAttributes,
} from 'vue'

type TElementTypeGeneric = 'paragraph' | 'container' | 'divider'
type TElementTypeExtended = 'image' | 'button' | 'link' | 'heading'
type TElementType = TElementTypeGeneric | TElementTypeExtended

interface TElementBase {
  id: number
  text: string
  content: TElement[]
  type: TElementType
  styles: CSSProperties
  class?: string | string[] | Record<string, string>
  properties: HTMLAttributes
  meta: {
    props: Record<string, any>
    hasChildren: boolean
    hideText?: boolean
    isComponent?: boolean
    allowChildrenType?: TElementType[]
  }
}

interface TElementGeneric extends TElementBase {
  type: TElementTypeGeneric
}

interface TElementExtended extends TElementBase {
  type: TElementTypeExtended
}

// Extended
interface TElementLink extends TElementExtended {
  type: 'link'
  properties: AnchorHTMLAttributes
}

interface TElementButton extends TElementExtended {
  type: 'button'
  properties: ButtonHTMLAttributes
}

interface TElementImage extends TElementExtended {
  type: 'image'
  properties: ImgHTMLAttributes
}

interface TElementHeading extends TElementExtended {
  type: 'heading'
  properties: HTMLAttributes
  meta: TElementBase['meta'] & {
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
}

export type TElement =
  | TElementLink
  | TElementButton
  | TElementImage
  | TElementHeading
  | TElementGeneric

export interface TElementComponent {
  id: number
  element: TElement
  props: Record<string, any>
}

export type TTabs = 'elements' | 'blocks' | 'components' | 'variables'
export type TVariableGroup = 'colors' | 'spacing' | 'radius' | 'breakpoints'
export type TVariable = Record<`--${TVariableGroup}-${string}`, string>
export type TVariableForm = {
  group: TVariableGroup
  name: string
  value: string
}
