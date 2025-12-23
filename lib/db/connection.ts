import mysql from 'mysql2/promise'

interface DbConfig {
	host: string
	user: string
	password: string
	database: string
	port?: number
}

let pool: mysql.Pool | null = null

export function createConnectionPool(config?: DbConfig) {
	if (pool) {
		return pool
	}

	const dbConfig: DbConfig = {
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'cinevault',
		port: parseInt(process.env.DB_PORT || '3306', 10),
		...config,
	}

	pool = mysql.createPool({
		...dbConfig,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0,
	})

	return pool
}

export function getPool() {
	if (!pool) {
		return createConnectionPool()
	}
	return pool
}

export async function query<T = unknown>(
	sql: string,
	params?: unknown[]
): Promise<T[]> {
	const connectionPool = getPool()
	const [rows] = await connectionPool.execute(sql, params)
	return rows as T[]
}

export async function queryOne<T = unknown>(
	sql: string,
	params?: unknown[]
): Promise<T | null> {
	const results = await query<T>(sql, params)
	return results[0] || null
}



