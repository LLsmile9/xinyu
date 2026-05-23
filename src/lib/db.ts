import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL || ''

  // If using Turso (libsql:// URL), use the LibSQL adapter
  if (url.startsWith('libsql://') || url.startsWith('https://')) {
    const libsql = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    })
    const adapter = new PrismaLibSql(libsql)
    return new PrismaClient({ adapter })
  }

  // Fallback: local SQLite for development
  return new PrismaClient()
}

// Lazy initialization - only create client when actually used
let _db: PrismaClient | undefined

export function getDb() {
  if (!_db) {
    _db = globalForPrisma.prisma ?? createPrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _db
  }
  return _db
}

// For convenience, also export as db (lazy getter)
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getDb() as any)[prop]
  }
})
