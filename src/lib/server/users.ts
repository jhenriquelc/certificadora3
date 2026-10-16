import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user, type UserRole } from '$lib/server/db/schema';

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	role: UserRole;
};

// Creates the user without opening a session, so the admin calling it stays signed in.
export async function createUser(input: CreateUserInput) {
	const ctx = await auth.$context;
	const email = input.email.trim().toLowerCase();

	if (await ctx.internalAdapter.findUserByEmail(email)) {
		throw new Error('USER_ALREADY_EXISTS');
	}

	const created = await ctx.internalAdapter.createUser(
		{
			name: input.name.trim(),
			email,
			emailVerified: true,
			role: input.role
		},
		{ method: 'admin' }
	);

	await ctx.internalAdapter.linkAccount({
		providerId: 'credential',
		accountId: created.id,
		userId: created.id,
		password: await ctx.password.hash(input.password)
	});

	return created;
}

export async function setUserRole(userId: string, role: UserRole) {
	await db.update(user).set({ role }).where(eq(user.id, userId));
}

// Soft delete: keeps the user row (and the events it created) and ends its open sessions.
export async function deactivateUser(userId: string) {
	const ctx = await auth.$context;
	await db.update(user).set({ deactivatedAt: new Date() }).where(eq(user.id, userId));
	await ctx.internalAdapter.deleteUserSessions(userId);
}

export async function reactivateUser(userId: string) {
	await db.update(user).set({ deactivatedAt: null }).where(eq(user.id, userId));
}
