import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.scss'

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        museum: { name: 'Museum', value: '#081B55' },
      },
    },
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'museum' },
  },
}

export default preview
