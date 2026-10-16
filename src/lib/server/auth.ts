import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { APIError } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, disableSignUp: true }, // only admins create users
	user: {
		additionalFields: {
			role: { type: ['user', 'admin'], required: true, defaultValue: 'user', input: false },
			deactivatedAt: { type: 'date', required: false, input: false } // soft delete: null = active
		}
	},
	databaseHooks: {
		session: {
			create: {
				// Deactivated accounts cannot sign in.
				before: async (session) => {
					const [owner] = await db
						.select({ deactivatedAt: user.deactivatedAt })
						.from(user)
						.where(eq(user.id, session.userId));
					if (owner?.deactivatedAt) {
						throw new APIError('FORBIDDEN', { message: 'Esta conta está inativa.' });
					}
				}
			}
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
