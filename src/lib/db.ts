import { createClient, type Client } from '@libsql/client'

const globalForDb = globalThis as unknown as {
  tursoClient: Client | undefined
}

function createTursoClient(): Client {
  const url = process.env.DATABASE_URL
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (url && (url.startsWith('libsql://') || url.startsWith('https://'))) {
    return createClient({ url, authToken: authToken || '' })
  }

  // Fallback for local dev (won't work in production without Turso)
  throw new Error('DATABASE_URL is not configured')
}

export const turso = globalForDb.tursoClient ?? createTursoClient()

if (process.env.NODE_ENV !== 'production') globalForDb.tursoClient = turso

// ============ Auto-create tables if they don't exist ============
let tablesInitialized = false;

export async function ensureTables(): Promise<void> {
  if (tablesInitialized) return;
  tablesInitialized = true;

  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Visitor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitorId TEXT NOT NULL UNIQUE,
        firstSeen TEXT NOT NULL,
        lastSeen TEXT NOT NULL,
        visits INTEGER NOT NULL DEFAULT 1
      )
    `);
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS CheckIn (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        answersJson TEXT NOT NULL,
        summary TEXT NOT NULL,
        encouragement TEXT NOT NULL,
        book TEXT NOT NULL DEFAULT '',
        visitorId TEXT NOT NULL DEFAULT '',
        createdAt TEXT NOT NULL
      )
    `);
    console.log('✅ Tables ensured');
  } catch (e) {
    console.error('❌ Failed to create tables:', e);
    tablesInitialized = false; // Retry next time
  }
}

// ============ Database helper functions ============

export interface CheckInRecord {
  id: number
  date: string
  time: string
  answersJson: string
  summary: string
  encouragement: string
  book: string
  visitorId: string
  createdAt: string
}

export interface VisitorRecord {
  id: number
  visitorId: string
  firstSeen: string
  lastSeen: string
  visits: number
}

export async function getAllCheckIns(): Promise<CheckInRecord[]> {
  const result = await turso.execute('SELECT * FROM CheckIn ORDER BY createdAt DESC')
  return result.rows as unknown as CheckInRecord[]
}

export async function getCheckInsByDate(date: string): Promise<CheckInRecord[]> {
  const result = await turso.execute({
    sql: 'SELECT * FROM CheckIn WHERE date = ? ORDER BY createdAt DESC',
    args: [date],
  })
  return result.rows as unknown as CheckInRecord[]
}

export async function createCheckIn(data: {
  date: string
  time: string
  answersJson: string
  summary: string
  encouragement: string
  book: string
  visitorId: string
}): Promise<void> {
  await turso.execute({
    sql: `INSERT INTO CheckIn (date, time, answersJson, summary, encouragement, book, visitorId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    args: [data.date, data.time, data.answersJson, data.summary, data.encouragement, data.book, data.visitorId],
  })
}

export async function upsertVisitor(visitorId: string): Promise<void> {
  await turso.execute({
    sql: `INSERT INTO Visitor (visitorId, firstSeen, lastSeen, visits) VALUES (?, datetime('now'), datetime('now'), 1)
          ON CONFLICT(visitorId) DO UPDATE SET lastSeen = datetime('now'), visits = visits + 1`,
    args: [visitorId],
  })
}

export async function getStats(): Promise<{
  totalVisitors: number
  totalCheckIns: number
  todayVisitors: number
  todayCheckIns: number
}> {
  const [visitors, checkIns, todayVisitors, todayCheckIns] = await Promise.all([
    turso.execute('SELECT COUNT(*) as count FROM Visitor'),
    turso.execute('SELECT COUNT(*) as count FROM CheckIn'),
    turso.execute("SELECT COUNT(*) as count FROM Visitor WHERE date(lastSeen) = date('now')"),
    turso.execute("SELECT COUNT(*) as count FROM CheckIn WHERE date = strftime('%Y-%m-%d', 'now')"),
  ])

  return {
    totalVisitors: (visitors.rows[0] as any).count,
    totalCheckIns: (checkIns.rows[0] as any).count,
    todayVisitors: (todayVisitors.rows[0] as any).count,
    todayCheckIns: (todayCheckIns.rows[0] as any).count,
  }
}
