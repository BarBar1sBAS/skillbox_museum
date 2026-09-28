import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import type { ViteDevServer } from 'vite'
import { defineConfig } from 'vitest/config'

function statsApi() {
  return {
    name: 'stats-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next()
          return
        }
        const href = pathToFileURL(join(process.cwd(), 'server/dev.ts')).href
        void import(href).then(
          (mod: {
            handleNode: (req: IncomingMessage, res: ServerResponse) => Promise<void>
          }) => mod.handleNode(req as IncomingMessage, res as ServerResponse),
        )
          .catch(() => {
            if (!res.headersSent) {
              res.statusCode = 500
              res.end()
            }
          })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), statsApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.stories.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.stories.tsx', 'src/test/**'],
      thresholds: { lines: 100, branches: 100, functions: 100, statements: 100 },
    },
  },
})
