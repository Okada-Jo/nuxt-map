import type { DrizzleError } from 'drizzle-orm';

import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import slugify from 'slug';

import db from '~/lib/db';
import { insertLocation, location } from '~/lib/db/schema';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }));
  }
  const result = await readValidatedBody(event, insertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map((i) => {
        return `${i.path.join('')}: ${i.message}`;
      })
      .join('; ');

    const data = result
      .error
      .issues
      .reduce((errors, i) => {
        errors[i.path.join('')] = i.message;
        return errors;
      }, {} as Record<string, string>);
    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = !!(await db.query.location.findFirst({
    where: and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  }));

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists',
    }));
  }

  const baseSlug = slugify(result.data.name);
  let slug = baseSlug;
  let existing;

  do {
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, slug),
    }));

    if (existing) {
      slug = `${baseSlug}-${nanoid()}`;
    }
  } while (existing);

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug') {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: 'Slug must be unique (the locationname is used to generate something',
      }));
    }
    throw e;
  }
});
