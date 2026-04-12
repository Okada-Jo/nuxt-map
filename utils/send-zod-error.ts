import type { H3Event } from 'h3';
import type { ZodError } from 'zod';

export default function sendZodError(event: H3Event, error: ZodError) {
  const statusMessage = error
    .issues
    .map((i) => {
      return `${i.path.join('')}: ${i.message}`;
    })
    .join('; ');

  const data = error
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
