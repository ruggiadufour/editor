import type { TElement } from '@/types'

export const BaseElements: TElement[] = [
  {
    id: 1,
    type: 'container',
    text: 'Container',
    content: [],
    meta: {
      hasChildren: true,
      props: {},
    },
    properties: {},
    styles: {
      width: '100%',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      minHeight: '100px',
    },
  },
  {
    id: 1,
    type: 'link',
    text: 'Link',
    content: [],
    meta: {
      hasChildren: false,
      props: {},
      allowChildrenType: ['paragraph', 'image'],
    },
    properties: {
      href: location.href,
    },
    styles: {
      width: 'fit-content',
      textDecoration: 'underline',
      color: 'blue',
      padding: '0.5rem',
      textAlign: 'start',
      display: 'inline-block',
    },
  },
  {
    id: 2,
    type: 'paragraph',
    text: 'Paragraph',
    content: [],
    meta: {
      hasChildren: false,
      props: {},
      allowChildrenType: ['image', 'link'],
    },
    properties: {},
    styles: {
      width: '100%',
      textAlign: 'start',
    },
  },
  {
    id: 3,
    type: 'heading',
    text: 'Heading',
    content: [],
    meta: {
      hasChildren: false,
      tag: 'h1',
      props: {},
      allowChildrenType: ['image', 'link'],
    },
    properties: {},
    styles: {
      width: '100%',
      textAlign: 'start',
    },
  },
  {
    id: 4,
    type: 'button',
    text: 'Button',
    content: [],
    meta: {
      hasChildren: true,
      props: {},
      allowChildrenType: ['paragraph', 'image'],
    },
    properties: {},
    styles: {
      backgroundColor: 'lightblue',
      color: 'black',
      padding: '10px',
      width: 'fit-content',
    },
  },
  {
    id: 5,
    type: 'image',
    text: 'Image',
    content: [],
    meta: {
      hasChildren: false,
      props: {},
    },
    properties: {
      src: 'https://static.semrush.com/blog/uploads/media/39/4f/394f92fd06792246f5833d1ab3c05c4d/reverse-image-search.svg',
    },
    styles: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      display: 'inline-block',
    },
  },
  {
    id: 6,
    type: 'divider',
    text: 'Divider',
    content: [],
    meta: {
      hasChildren: false,
      hideText: true,
      props: {},
    },
    properties: {},
    styles: {
      width: '100%',
    },
  },
  {
    id: 7,
    type: 'list',
    text: 'List',
    content: [],
    meta: {
      hasChildren: true,
      props: {},
      allowChildrenType: ['list-item'],
    },
    properties: {},
    styles: {
      width: '100%',
      minHeight: '100px',
      listStyleType: 'disc',
      listStyle: 'inside',
    },
  },
  {
    id: 8,
    type: 'list-item',
    text: 'List item',
    content: [],
    meta: {
      hasChildren: false,
      props: {},
      allowChildrenType: ['paragraph', 'link', 'image'],
    },
    properties: {},
    styles: {
      width: '100%',
    },
  },
]
