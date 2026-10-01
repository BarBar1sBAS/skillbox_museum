import { useEffect } from 'react'
import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.scss'
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Museum theme',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      useEffect(() => {
        document.documentElement.dataset.theme = theme
      }, [theme])
      return (
        <div
          data-theme={theme}
          style={{
            background: 'var(--background-default)',
            color: 'var(--text-primary)',
            minHeight: '100vh',
            padding: 20,
          }}
        >
          <Story />
        </div>
      )
    },
  ],
  parameters: { controls: { matchers: { date: /Date$/i } } },
}
export default preview
