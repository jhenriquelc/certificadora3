import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const eventStatus = pgEnum('event_status', ['draft', 'published', 'cancelled']);

export const event = pgTable('event', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description').notNull().default(''),
	location: text('location').notNull(),
	startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
	endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
	capacity: integer('capacity'), // null = unlimited
	status: eventStatus('status').notNull().default('draft'),
	createdById: text('created_by_id').references(() => user.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// Visitors have no account: each registration stores their identification.
export const eventRegistration = pgTable(
	'event_registration',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => event.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		email: text('email').notNull(),
		ra: text('ra').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [unique('event_registration_event_ra_unique').on(table.eventId, table.ra)]
);

export const eventRelations = relations(event, ({ one, many }) => ({
	createdBy: one(user, { fields: [event.createdById], references: [user.id] }),
	registrations: many(eventRegistration)
}));

export const eventRegistrationRelations = relations(eventRegistration, ({ one }) => ({
	event: one(event, { fields: [eventRegistration.eventId], references: [event.id] })
}));

export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;
export type EventRegistration = typeof eventRegistration.$inferSelect;
export type NewEventRegistration = typeof eventRegistration.$inferInsert;
export type UserRole = (typeof user.$inferSelect)['role'];

export * from './auth.schema';
