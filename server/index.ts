import { existsSync, statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleApi } from './stats.ts'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))

function staticFile(pathname: string) {
  let decoded = '/'
  try {
    decoded = decodeURIComponent(pathname.split('?')[0] ?? '/')
  } catch {
    return null
  }
  const path = resolve(dist, `.${decoded}`)
  if (path !== dist && !path.startsWith(dist + sep)) return null
  return path
}

function indexHtml() {
  const file = resolve(dist, 'index.html')
  if (!existsSync(file)) return new Response(null, { status: 404 })
  return new Response(Bun.file(file))
}

function serveStatic(pathname: string) {
  const path = staticFile(pathname)
  if (!path) return new Response(null, { status: 400 })
  const name = path.split(sep).pop() ?? ''
  const asset = name.includes('.')
  if (path === dist || !existsSync(path) || statSync(path).isDirectory()) {
    return asset ? new Response(null, { status: 404 }) : indexHtml()
  }
  return new Response(Bun.file(path))
}

const port = Number(process.env.PORT) || 4173

const server = Bun.serve({
  port,
  fetch(req, peer) {
    const url = new URL(req.url)
    if (url.pathname.startsWith('/api/')) {
      const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      const ip = forwarded || peer.requestIP(req)?.address || 'local'
      return handleApi(req, ip)
    }
    return serveStatic(url.pathname)
  },
})

if (!process.env.ADMIN_KEY) console.warn('ADMIN_KEY is empty, stats stay closed')
console.log(`http://localhost:${server.port}`)
