import type { Preview } from '@storybook/nextjs-vite'
import '@fontsource/bebas-neue/400.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import '../src/styles/globals.css'

// Called-It is dark-only, so the canvas is a fixed hex (kept independent of tokens so before/after diffs are fair).
const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    nextjs: { appDirectory: true },
    controls: { matchers: { color: /(background|color)$/i } },
  },
  decorators: [
    (Story) => {
      document.body.style.background = '#0A0A0B'
      return Story()
    },
  ],
}

export default preview
