import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleApi } from './stats.ts'

function text(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

const HOP = new Set(['host', 'connection', 'content-length', 'transfer-encoding'])

export async function handleNode(req: IncomingMessage, res: ServerResponse) {
  const host = text(req.headers.host) ?? 'localhost'
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (HOP.has(key)) continue
    const item = text(value)
    if (item) headers.set(key, item)
  }
  const method = req.method ?? 'GET'
  let body: string | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      req.on('data', (chunk: Buffer) => chunks.push(chunk))
      req.on('end', () => resolve(Buffer.concat(chunks).toString()))
      req.on('error', reject)
    })
  }
  const request = new Request(new URL(req.url ?? '/', `http://${host}`), {
    method,
    headers,
    body: body ? body : undefined,
  })
  const forwarded = text(req.headers['x-forwarded-for'])
  const ip = forwarded?.split(',')[0]?.trim() || req.socket.remoteAddress || 'local'
  const response = await handleApi(request, ip)
  res.statusCode = response.status
  const type = response.headers.get('content-type')
  if (type) res.setHeader('content-type', type)
  res.end(Buffer.from(await response.arrayBuffer()))
}
