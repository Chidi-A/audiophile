import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL!;
// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const adapter = new PrismaNeon({ connectionString });
// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// Export the Prisma Client with the Neon adapter
export const prisma = new PrismaClient({ adapter });
