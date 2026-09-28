declare module 'bun:sqlite' {
  export class Database {
    constructor(filename: string)
    exec(sql: string): void
    query<T>(sql: string): {
      all(...params: unknown[]): T[]
      get(...params: unknown[]): T | null
      run(...params: unknown[]): { changes: number }
    }
  }
}

interface BunServer {
  port: number
  requestIP(req: Request): { address: string } | null
}

declare const Bun: {
  serve(options: {
    port?: number
    fetch(req: Request, server: BunServer): Response | Promise<Response>
  }): { port: number }
  file(path: string): Blob
}
