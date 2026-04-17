import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import type { InsertLocation } from '../schema';

import db from '..';
import { location } from '../schema';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5);

export async function findLocation(slug: string, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
    with: {
      locationLogs: true,
    },
  });
}

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findLocationByName(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(baseSlug: string) {
  let slug = baseSlug;

  while (await findLocationBySlug(slug)) {
    slug = `${baseSlug}-${nanoid()}`;
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  return created;
}

export async function updateLocationBySlug(
  updates: InsertLocation,
  slug: string,
  userId: number,
) {
  const [updated] = await db.update(location).set(updates).where(and(
    eq(location.slug, slug),
    eq(location.userId, userId),
  )).returning();

  return updated;
}
