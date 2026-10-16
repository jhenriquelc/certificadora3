// Creates the first admin from ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (.env).
// Runs outside SvelteKit, so it writes the Better Auth rows directly.
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { hashPassword } from 'better-auth/crypto';
import postgres from 'postgres';

if (existsSync('.env')) process.loadEnvFile('.env');

const { DATABASE_URL, ADMIN_NAME = 'Administrador', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
if (ADMIN_PASSWORD.length < 8) throw new Error('ADMIN_PASSWORD must have at least 8 characters');

const sql = postgres(DATABASE_URL);
const email = ADMIN_EMAIL.trim().toLowerCase();

try {
	const [existing] = await sql`select id, role, deactivated_at from "user" where email = ${email}`;

	if (existing) {
		if (existing.role !== 'admin' || existing.deactivated_at) {
			await sql`
				update "user" set role = 'admin', deactivated_at = null, updated_at = now()
				where id = ${existing.id}`;
			console.log(`Promoted ${email} to active admin.`);
		} else {
			console.log(`Admin ${email} already exists.`);
		}
	} else {
		const userId = randomUUID();
		const password = await hashPassword(ADMIN_PASSWORD);

		await sql.begin(async (tx) => {
			await tx`
				insert into "user" (id, name, email, email_verified, role)
				values (${userId}, ${ADMIN_NAME}, ${email}, true, 'admin')`;
			await tx`
				insert into account (id, account_id, provider_id, user_id, password, updated_at)
				values (${randomUUID()}, ${userId}, 'credential', ${userId}, ${password}, now())`;
		});
		console.log(`Created admin ${email}.`);
	}
} finally {
	await sql.end();
}
