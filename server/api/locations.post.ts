import db from '~/lib/db';
import { insertLocation, location } from '~/lib/db/schema';

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
  const [created] = await db.insert(location).values({
    ...result.data,
    slug: result.data.name.replaceAll(' ', '-').toLowerCase(),
    userId: event.context.user.id,
  }).returning();

  return created;
});
